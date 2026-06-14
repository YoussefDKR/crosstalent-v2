import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnv() {
  const raw = readFileSync(resolve(".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    env[t.slice(0, i)] = t.slice(i + 1);
  }
  return env;
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = loadEnv();
const base = `${NEXT_PUBLIC_SUPABASE_URL}/rest/v1`;

async function check() {
  const headers = {
    apikey: SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
  };

  const jobs = await fetch(`${base}/jobs?select=expires_at&limit=1`, { headers });
  if (!jobs.ok) throw new Error(`jobs query failed: ${jobs.status}`);

  const subs = await fetch(
    `${base}/employer_subscriptions?select=post_credits&limit=1`,
    { headers }
  );
  if (!subs.ok) throw new Error(`subscriptions query failed: ${subs.status}`);

  console.log("OK: expires_at and post_credits columns exist");
}

check().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
