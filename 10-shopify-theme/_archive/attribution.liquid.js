<script id="utms">
(function(){
  if (window.__th_dl_utms) return; window.__th_dl_utms = true;

  function qp(name){
    var s = (window.location.search || '').replace(/^\?/,'');
    var re = new RegExp('(?:^|&)' + name + '=([^&]+)');
    var m = s.match(re);
    return m ? decodeURIComponent(m[1].replace(/\+/g,' ')) : '';
  }
  function host(u){ try{ return (u.split('/')[2] || ''); }catch(e){ return ''; } }
  function setOnce(k,v){ try{ if(v && window.localStorage && !localStorage.getItem(k)) localStorage.setItem(k,v); }catch(e){} }
  function setNowSS(k,v){ try{ if(window.sessionStorage) sessionStorage.setItem(k, v || ''); }catch(e){} }
  function getSS(k){ try{ return window.sessionStorage ? sessionStorage.getItem(k) : ''; }catch(e){ return ''; } }
  function getLS(k){ try{ return window.localStorage ? localStorage.getItem(k) : ''; }catch(e){ return ''; } }

  // Consent gate (optional): flip to true if consent not required or already granted
  var consent_ok = true;
  if (!consent_ok) return;

  var ref = document.referrer || '';
  var is_ext_ref = ref && ref.indexOf(location.hostname) === -1;
  var ref_host = is_ext_ref ? host(ref) : '';

  // Current URL values
  var cur = {
    utm_source:   qp('utm_source'),
    utm_medium:   qp('utm_medium'),
    utm_campaign: qp('utm_campaign'),
    utm_content:  qp('utm_content'),
    utm_term:     qp('utm_term'),
    utm_id:       qp('utm_id'),
    gclid:        qp('gclid'),
    fbclid:       qp('fbclid'),
    msclkid:      qp('msclkid')
  };

  // Defaults for source/medium when empty
  if (!cur.utm_source) cur.utm_source = is_ext_ref ? 'referral' : 'direct';
  if (!cur.utm_medium) cur.utm_medium = is_ext_ref ? 'referral' : 'none';

  var landing_page = location.pathname + location.search;
  var data_source  = (qp('utm_source') || qp('gclid') || qp('fbclid') || qp('msclkid')) ? 'url' :
                     (is_ext_ref ? 'referrer' : 'implicit');
  var timestamp    = new Date().toISOString();

  // FT: write once to localStorage
  setOnce('ft_source',          cur.utm_source);
  setOnce('ft_medium',          cur.utm_medium);
  setOnce('ft_campaign',        qp('utm_campaign'));
  setOnce('ft_content',         qp('utm_content'));
  setOnce('ft_term',            qp('utm_term'));
  setOnce('ft_id',              qp('utm_id'));
  setOnce('ft_referrer_host',   ref_host);
  setOnce('ft_landing_page',    landing_page);

  // LT: refresh each pageview in sessionStorage
  setNowSS('lt_source',         cur.utm_source);
  setNowSS('lt_medium',         cur.utm_medium);
  setNowSS('lt_campaign',       qp('utm_campaign'));
  setNowSS('lt_content',        qp('utm_content'));
  setNowSS('lt_term',           qp('utm_term'));
  setNowSS('lt_id',             qp('utm_id'));
  setNowSS('lt_referrer_host',  ref_host);
  setNowSS('lt_landing_page',   landing_page);

  // DataLayer push (flat keys, ES5)
  window.dataLayer = window.dataLayer || [];
  var payload = {
    event: 'terra_sanity_ready',
    ft_data_source: data_source,
    ft_timestamp: timestamp,

    // FT
    ft_source:   getLS('ft_source')   || '',
    ft_medium:   getLS('ft_medium')   || '',
    ft_campaign: getLS('ft_campaign') || '',
    ft_content:  getLS('ft_content')  || '',
    ft_term:     getLS('ft_term')     || '',
    ft_id:       getLS('ft_id')       || '',
    ft_referrer_host: getLS('ft_referrer_host') || '',
    ft_landing_page:  getLS('ft_landing_page')  || '',

    // LT
    lt_source:   getSS('lt_source')   || '',
    lt_medium:   getSS('lt_medium')   || '',
    lt_campaign: getSS('lt_campaign') || '',
    lt_content:  getSS('lt_content')  || '',
    lt_term:     getSS('lt_term')     || '',
    lt_id:       getSS('lt_id')       || '',
    lt_referrer_host: getSS('lt_referrer_host') || '',
    lt_landing_page:  getSS('lt_landing_page')  || ''
  };

  try { window.dataLayer.push(payload); } catch(e){}
})();
</script>
