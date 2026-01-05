/* raw-collector/index.js — CANONICAL (dev)
   - passive raw ledger
   - auth via x-terra-secret
   - cors for browser pixels
   - writes native JSON payload
*/

const express = require("express");
const { BigQuery } = require("@google-cloud/bigquery");

const app = express();

/* CORS (lowercased headers, preflight) */
app.use((req, res, next) => {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "post,options");
  res.setHeader("access-control-allow-headers", "content-type,x-terra-secret");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.use(express.json({ limit: "512kb" }));

const bq = new BigQuery();
const DATASET = "raw_dev";
const TABLE = "shopify_pixel_events";
const SECRET = process.env.TERRA_SECRET;

app.post("/track", async (req, res) => {
  if (!SECRET || req.get("x-terra-secret") !== SECRET) {
    return res.status(401).end();
  }

  try {
    const body = req.body || {};

    const row = {
      received_at: new Date(),
      source: body.source || "shopify_pixel",
      shopify_event: body.event || null,
      event_id: body.event_id || null,
      payload: body,
      th_vid: body.th_vid || null,
      session_key: body.session_key || null,
      session_start: body.session_start ? new Date(body.session_start) : null
    };

    await bq.dataset(DATASET).table(TABLE).insert([row]);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

const port = process.env.PORT || 8080;
app.listen(port);
