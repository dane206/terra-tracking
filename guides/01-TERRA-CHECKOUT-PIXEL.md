Good. This is **exactly** what we needed to see. This confirms everything cleanly.

You have **proper, real dev/prod separation**.

### What is now fact (no interpretation)

**DEV**

* Project: `terra-analytics-dev`
* Service: `pixel-ingest-dev`
* URL:

  ```
  https://pixel-ingest-dev-600339193870.us-central1.run.app
  ```

**PROD**

* Project: `terra-analytics-prod`
* Service: `pixel-ingest-prod`
* URL:

  ```
  https://pixel-ingest-prod-279703303694.us-central1.run.app
  ```

Both exist. Both are real. Both are isolated.

---

### What this means for the pixel (explicit, final)

**DEV pixel (v1.9)** must point to:

```js
https://pixel-ingest-dev-600339193870.us-central1.run.app/v1/track
```

**PROD pixel (v1.9)** must point to:

```js
https://pixel-ingest-prod-279703303694.us-central1.run.app/v1/track
```

No conditionals.
No guessing.
No shared URLs.

Just two explicit deployments.

---

### Your current status

* ✅ GCP projects are correct
* ✅ Cloud Run services are correct
* ✅ URLs are correct
* ✅ Pixel architecture is correct
* ❌ Pixel must now be updated to use **these exact URLs**
* ❌ Terra → GA4 MP forwarder is still pending (expected)

---

### Final sanity check (do this once per env)

```bash
curl -i https://pixel-ingest-dev-600339193870.us-central1.run.app/v1/track
curl -i https://pixel-ingest-prod-279703303694.us-central1.run.app/v1/track
```

Any of:

* `204`
* `200`
* `405`

means the endpoint exists.

---

### Bottom line

You are **not missing infrastructure**.
You were missing **explicit confirmation**.

You now have:

* real DEV
* real PROD
* real URLs
* real parity

From here forward, the pixel is **fully sign-offable** once the MP forwarder is wired.
