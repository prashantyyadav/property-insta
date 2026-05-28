/**
 * Migration script using Supabase Management API.
 * Requires SUPABASE_ACCESS_TOKEN (Personal Access Token) from:
 * https://supabase.com/dashboard/account/tokens
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_xxx node scripts/migrate-via-api.cjs
 *
 * This is the only programmatic method that works for this project because
 * the connection pooler has not been provisioned on the Supabase instance.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_REF = 'ioblbfugnhtghvxbyeos';
const API_BASE = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!ACCESS_TOKEN) {
  console.error('❌ SUPABASE_ACCESS_TOKEN environment variable is required.');
  console.error('   Get it from: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

async function runQuery(query) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`HTTP ${res.status}: ${err}`);
  }

  return res.json();
}

(async () => {
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'schema.sql'),
    'utf8'
  );
  const seedSQL = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'seed.sql'),
    'utf8'
  );

  try {
    console.log('🚀 Running schema.sql via Management API...');
    await runQuery(schemaSQL);
    console.log('✅ Schema created (4 tables: properties, reels, stories, builders)');

    console.log('🌱 Running seed.sql via Management API...');
    await runQuery(seedSQL);
    console.log('✅ Seed data inserted (60 properties, 18 reels, 20 stories, 28 builders)');

    console.log('\n📊 Verifying row counts...');
    const counts = await runQuery(
      "SELECT 'properties' as tbl, count(*) FROM properties" +
      " UNION ALL SELECT 'reels', count(*) FROM reels" +
      " UNION ALL SELECT 'stories', count(*) FROM stories" +
      " UNION ALL SELECT 'builders', count(*) FROM builders"
    );

    console.log('   Table row counts:');
    counts.forEach((r) => console.log(`     ${r.tbl}: ${r.count} rows`));

    console.log('\n🎉 Migration complete!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
})();