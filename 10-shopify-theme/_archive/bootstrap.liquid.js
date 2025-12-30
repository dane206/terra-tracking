{%- comment -%}
  Terra Bootstrap - Fully Annotated Version
  ----------------------------------------
  Responsibilities:
    1. Run once per page load (guarded)
    2. Set visitor ID (th_vid cookie, 2 years)
    3. Set session (session_key, session_start in sessionStorage)
    4. Compute ISO week
    5. Detect device type
    6. Determine page type & subdomain
    7. Extract Shopify context
    8. Capture UTM first-touch and last-touch
    9. Push multiple context-heavy Terra events
   10. Optionally push logged-in user events with hashed PII
   11. Expose helpers: window.terraGetUUID(), window.terraNowIso(), window.terra_ctx
{%- endcomment -%}

<script id="terra_bootstrap">
(function () {

  /* -------------------- GUARD -------------------- */
  if (window.__terra_bootstrap_ran) return;       // ensure runs only once
  window.__terra_bootstrap_ran = true;
  window.dataLayer = window.dataLayer || [];

  /* -------------------- UTILITIES -------------------- */
  function getUUID() {                              // generate UUID v4
    try { return crypto.randomUUID(); } catch(e){}
    var t = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return t.replace(/[xy]/g,function(c){
      var r=Math.random()*16|0, v=c==='x'?r:(r&3|8); return v.toString(16);
    });
  }

  function getNowIso(){ return new Date().toISOString(); } // current timestamp ISO
  function getISOWeekLabel(){                                // ISO week YYYY_WW
    var d=new Date();
    var t=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()));
    var dayNr=t.getUTCDay(); if(dayNr===0) dayNr=7;
    t.setUTCDate(t.getUTCDate()+4-dayNr);
    var year=t.getUTCFullYear();
    var s=new Date(Date.UTC(year,0,1));
    var w=Math.ceil(((t-s)/86400000+1)/7);
    return year+'_W'+(w<10?'0'+w:w);
  }

  function getDeviceType(){                          // detect device
    var ua=(navigator.userAgent||'').toLowerCase();
    if(ua.includes('iphone')||(ua.includes('android')&&ua.includes('mobile'))) return 'mobile';
    if(ua.includes('ipad')||(ua.includes('android')&&!ua.includes('mobile'))) return 'tablet';
    return 'desktop';
  }

  function getCookieValue(name){                     // read cookie
    try{ var m=document.cookie.match(new RegExp('(?:^|; )'+name+'=([^;]*)'));
      return m?decodeURIComponent(m[1]):''; }catch(e){return'';}
  }

  function setCookieValue(name,val,maxAgeSeconds,domainOpt){ // write cookie
    try{
      var parts=[name+'='+encodeURIComponent(val),'Path=/'];
      if(maxAgeSeconds) parts.push('Max-Age='+String(maxAgeSeconds));
      if(domainOpt) parts.push('Domain='+domainOpt);
      parts.push('SameSite=Lax');
      if(location.protocol==='https:') parts.push('Secure');
      document.cookie=parts.join('; ');
    } catch(e){}
  }

  function safeLSget(k){ try{return localStorage.getItem(k);}catch(e){return null;} }
  function safeLSset(k,v){ try{localStorage.setItem(k,v);}catch(e){} }
  function safeSSget(k){ try{return sessionStorage.getItem(k);}catch(e){return null;} }
  function safeSSset(k,v){ try{sessionStorage.setItem(k,v);}catch(e){} }

  /* -------------------- PAGE TYPE & SUBDOMAIN -------------------- */
  function getPageType(){
    try{
      if(window.ShopifyAnalytics && ShopifyAnalytics.meta && ShopifyAnalytics.meta.page && ShopifyAnalytics.meta.page.pageType)
        return String(ShopifyAnalytics.meta.page.pageType);
    }catch(e){}
    var path=(location.pathname||'').toLowerCase();
    if(/\/(checkouts|orders)\/[^\/]+\/thank[_-]?you/.test(path)) return 'thank_you';
    if(/post-purchase/.test(path)) return 'post_purchase';
    if(/\/checkouts?/.test(path)) return 'checkout';
    if(/\/(cart|basket)/.test(path)) return 'cart';
    if(/\/products\//.test(path)) return 'product';
    if(/\/collections\//.test(path)){
      if(path.indexOf('/search')!==-1) return 'searchresults';
      return 'collection';
    }
    if(/\/pages\//.test(path)) return 'pages';
    if(/[?&](q|query|search)=/i.test(location.href)) return 'searchresults';
    if(path==='/'||path==='') return 'home';
    return 'other';
  }

  function getSubdomain(hostname){
    hostname=(hostname||'').toLowerCase();
    var parts=hostname.split('.');
    if(parts.length<=1) return parts[0]||'';
    if(parts.length===2) return 'www';
    return parts[0]||'';
  }

  /* -------------------- UTM FIRST/ LAST TOUCH -------------------- */
  function getUTMState(){
    var url=null; try{url=new URL(location.href);}catch(e){}
    function qp(param){ if(url && url.searchParams){ var v=url.searchParams.get(param); return v==null?'':v; } var s=(location.search||'').replace(/^\?/,''); var re=new RegExp('(?:^|&)'+param+'=([^&]+)'); var m=s.match(re); return m?decodeURIComponent(m[1].replace(/\+/g,' ')) : ''; }
    var ref=document.referrer||'', host=location.hostname||'', is_ext_ref=ref && ref.indexOf(host)===-1;
    var ref_host=''; if(is_ext_ref){ try{ var ru=new URL(ref); ref_host=ru.hostname||''; }catch(e){ ref_host=(ref.split('/')[2]||''); } }
    var cur={utm_source:qp('utm_source'),utm_medium:qp('utm_medium'),utm_campaign:qp('utm_campaign'),utm_content:qp('utm_content'),utm_term:qp('utm_term'),utm_id:qp('utm_id'),gclid:qp('gclid'),fbclid:qp('fbclid'),msclkid:qp('msclkid')};
    if(!cur.utm_source) cur.utm_source=is_ext_ref?'referral':'direct';
    if(!cur.utm_medium) cur.utm_medium=is_ext_ref?'referral':'none';
    var landing_page=(location.pathname||'')+(location.search||'');
    var hasExplicit=!!(qp('utm_source')||qp('gclid')||qp('fbclid')||qp('msclkid'));
    var data_source=hasExplicit?'url':(is_ext_ref?'referrer':'implicit');
    var nowIso=getNowIso();
    function setOnceLS(k,v){ if(!v) return; if(!safeLSget(k)) safeLSset(k,v); }
    setOnceLS('ft_source',cur.utm_source); setOnceLS('ft_medium',cur.utm_medium); setOnceLS('ft_campaign',qp('utm_campaign')); setOnceLS('ft_content',qp('utm_content')); setOnceLS('ft_term',qp('utm_term')); setOnceLS('ft_id',qp('utm_id'));
    setOnceLS('ft_gclid',qp('gclid')); setOnceLS('ft_fbclid',qp('fbclid')); setOnceLS('ft_msclkid',qp('msclkid')); setOnceLS('ft_referrer_host',ref_host); setOnceLS('ft_landing_page',landing_page); setOnceLS('ft_data_source',data_source); setOnceLS('ft_origin',data_source); setOnceLS('ft_timestamp',nowIso);

    safeSSset('lt_source',cur.utm_source); safeSSset('lt_medium',cur.utm_medium); safeSSset('lt_campaign',qp('utm_campaign')); safeSSset('lt_content',qp('utm_content')); safeSSset('lt_term',qp('utm_term')); safeSSset('lt_id',qp('utm_id')); safeSSset('lt_gclid',qp('gclid')); safeSSset('lt_fbclid',qp('fbclid')); safeSSset('lt_msclkid',qp('msclkid'));
    safeSSset('lt_referrer_host',ref_host); safeSSset('lt_landing_page',landing_page); safeSSset('lt_data_source',data_source); safeSSset('lt_origin',data_source); safeSSset('lt_timestamp',nowIso);

    var out={};
    ['source','medium','campaign','content','term','id','gclid','fbclid','msclkid','referrer_host','landing_page','data_source','origin','timestamp'].forEach(function(k){
      out['ft_'+k]=safeLSget('ft_'+k)||'';
      out['lt_'+k]=safeSSget('lt_'+k)||'';
    });
    out.utm_data_source=data_source;
    return out;
  }

  /* -------------------- IDENTITY + SESSION -------------------- */
  var BASE_DOMAIN=location.hostname.indexOf('terrahealthessentials.com')!==-1?'.terrahealthessentials.com':'';
  var th_vid=getCookieValue('th_vid'); 
  if(!th_vid){ th_vid=getUUID(); setCookieValue('th_vid',th_vid,60*60*24*365*2,BASE_DOMAIN); }
  window.th_vid=th_vid;

  var customer=null;
  {% if customer %}
    customer={ id: {{ customer.id | json }}, email: {{ customer.email | json }}, phone: {{ customer.phone | json }}, first_name: {{ customer.first_name | json }}, last_name: {{ customer.last_name | json }}, address1: {{ customer.default_address.address1 | json }}, city: {{ customer.default_address.city | json }}, province_code: {{ customer.default_address.province_code | json }}, zip: {{ customer.default_address.zip | json }}, country_code: {{ customer.default_address.country_code | json }} };
  {% endif %}

  var terra_customer_id=(customer&&customer.id)?String(customer.id):null;
  var visitor_type=terra_customer_id?'logged_in':'guest';
  var session_key=safeSSget('session_key'); 
  var session_start=safeSSget('session_start');
  if(!session_key){ session_key=getUUID(); session_start=getNowIso(); safeSSset('session_key',session_key); safeSSset('session_start',session_start); }

  /* -------------------- PAGE CONTEXT -------------------- */
  var page_type=getPageType();
  var iso_week=getISOWeekLabel();
  var device_type=getDeviceType();
  var currency={{ shop.currency | json }}||'USD';
  var country={{ request.country | json }}||'US';
  var hostname=location.hostname||''; 
  var subdomain=getSubdomain(hostname);
  if(subdomain==='quiz') page_type='quiz'; 
  else if(['edu','articles','blog'].includes(subdomain)) page_type='presale';

  var seg=(location.pathname||'').replace(/^\/+/,'').split('/');
  var item_list_name=(seg[0]==='collections'&&seg[1])?seg[1]:'product_direct';
  var item_list_id=(seg.indexOf('products')!==-1&&seg[seg.length-1])?seg[seg.length-1].replace(/\?.*$/,'').replace(/-/g,'_'):item_list_name;

  var utmState=getUTMState();

  var ctx={ 
    event_id:getUUID(), timestamp:getNowIso(), iso_week:iso_week, shop_domain:hostname, shop_currency:currency,
    page_location:location.href, page_referrer:document.referrer||'', page_title:document.title||'', page_path:location.pathname,
    page_type:page_type, collection_handle:seg[1]||'', product_handle:seg[seg.length-1]||'', device_type:device_type,
    currency:currency, country:country, visitor_type:visitor_type, th_vid:th_vid, terra_customer_id:terra_customer_id,
    user_id:terra_customer_id, session_key:session_key, session_start:session_start,
    item_list_name:item_list_name, item_list_id:item_list_id, subdomain:subdomain
  };

  for(var k in utmState){ if(Object.prototype.hasOwnProperty.call(utmState,k)) ctx[k]=utmState[k]; }
  window.terra_ctx=ctx;
  window.terraGetUUID=getUUID; window.terraNowIso=getNowIso;

  /* -------------------- PUSH EVENTS -------------------- */
  function pushTerraVerb(verb){
    var ev={event:verb,page_type:ctx.page_type};
    for(var k in ctx){ if(Object.prototype.hasOwnProperty.call(ctx,k)&&k!=='page_type') ev[k]=ctx[k]; }
    window.dataLayer.push(ev);
    if(window.console&&console.log) console.log('[terra-bootstrap]',verb,'pushed',ev);
  }

  pushTerraVerb('terra_identity_ready');
  pushTerraVerb('terra_page_context');
  pushTerraVerb('terra_utm_attribution');
  pushTerraVerb('terra_shopify_loaded');
  pushTerraVerb('terra_page_view');

  /* -------------------- OPTIONAL USER EVENTS -------------------- */
  if(terra_customer_id&&!safeSSget('terra_user_login_fired')){
    var loginEv={ event:'terra_user_login', event_id:getUUID(), timestamp:getNowIso(), user_id:terra_customer_id, terra_customer_id:terra_customer_id, th_vid:th_vid, page_location:ctx.page_location, page_path:ctx.page_path, page_title:ctx.page_title, page_type:ctx.page_type, device_type:ctx.device_type, currency:ctx.currency, country:ctx.country };
    window.dataLayer.push(loginEv); safeSSset('terra_user_login_fired','1'); if(window.console&&console.log) console.log('[terra] terra_user_login pushed',loginEv);
  }

  /* -------------------- USER DATA HASHED -------------------- */
  if(terra_customer_id&&!safeSSget('terra_user_data_fired')&&window.crypto&&crypto.subtle&&window.TextEncoder){
    var email=(customer&&customer.email)?String(customer.email).trim().toLowerCase():null;
    var phone=(customer&&customer.phone)?String(customer.phone).replace(/[^0-9]/g,''):null;
    var fn=(customer&&customer.first_name)?String(customer.first_name).trim().toLowerCase():null;
    var ln=(customer&&customer.last_name)?String(customer.last_name).trim().toLowerCase():null;
    var a1=(customer&&customer.address1)?String(customer.address1).trim().toLowerCase():null;
    var city=(customer&&customer.city)?String(customer.city).trim().toLowerCase():null;
    var prov=(customer&&customer.province_code)?String(customer.province_code).trim().toLowerCase():null;
    var zip=(customer&&customer.zip)?String(customer.zip).trim().toLowerCase():null;
    var cc=(customer&&customer.country_code)?String(customer.country_code).trim().toLowerCase():null;

    function sha256(str){ 
      return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(buf){ 
        var out=''; var view=new Uint8Array(buf); for(var i=0;i<view.length;i++){ var h=view[i].toString(16); if(h.length<2) h='0'+h; out+=h; } 
        return out; 
      }); 
    }

    (function sendUserData(){
      var user_data={}; var promises=[];
      if(email) promises.push(sha256(email).then(h=>user_data.email=h));
      if(phone) promises.push(sha256(phone).then(h=>user_data.phone_number=h));
      if(fn) promises.push(sha256(fn).then(h=>user_data.first_name=h));
      if(ln) promises.push(sha256(ln).then(h=>user_data.last_name=h));
      if(a1) promises.push(sha256(a1).then(h=>user_data.address_hashed=h));
      if(city) user_data.city=city; if(prov) user_data.region=prov; if(zip) user_data.postal_code=zip; if(cc) user_data.country=cc;
      Promise.all(promises).then(function(){ 
        if(Object.keys(user_data).length>0){ 
          user_data.event='terra_user_data'; user_data.event_id=getUUID(); user_data.timestamp=getNowIso(); user_data.th_vid=th_vid; user_data.page_location=ctx.page_location; user_data.page_path=ctx.page_path; 
          window.dataLayer.push(user_data); safeSSset('terra_user_data_fired','1'); 
          if(window.console&&console.log) console.log('[terra] terra_user_data pushed',user_data); 
        } 
      });
    })();
  }

})();
</script>
