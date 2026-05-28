const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connections = [
  {
    label: 'pooler + SNI (servername)',
    config: {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres',
      password: 'sY/Z6pWjcx/NqVd',
      ssl: {
        rejectUnauthorized: false,
        servername: 'aws-0-ap-south-1.pooler.supabase.com',
      },
    },
  },
  {
    label: 'pooler + SNI (servername=supabase.co)',
    config: {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres',
      password: 'sY/Z6pWjcx/NqVd',
      ssl: {
        rejectUnauthorized: false,
        servername: 'ioblbfugnhtghvxbyeos.supabase.co',
      },
    },
  },
  {
    label: 'pooler + SNI (servername=db.supabase.co)',
    config: {
      host: 'aws-0-ap-south-1.pooler.supabase.com',
      port: 6543,
      database: 'postgres',
      user: 'postgres',
      password: 'sY/Z6pWjcx/NqVd',
      ssl: {
        rejectUnauthorized: false,
        servername: 'db.ioblbfugnhtghvxbyeos.supabase.co',
      },
    },
  },
];

(async () => {
  const schemaSQL = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'schema.sql'),
    'utf8'
  );
  const seedSQL = fs.readFileSync(
    path.join(__dirname, '..', 'supabase', 'seed.sql'),
    'utf8'
  );

  for (const conn of connections) {
    console.log('Trying:', conn.label, '...');
    const pool = new Pool(conn.config);
    try {
      const client = await pool.connect();
      console.log('Connected!');

      console.log('Running schema.sql...');
      await client.query(schemaSQL);
      console.log('Schema created.');

      console.log('Running seed.sql...');
      await client.query(seedSQL);
      console.log('Seed data inserted.');

      const { rows: counts } = await client.query(
        "SELECT 'properties' as tbl, count(*) FROM properties" +
        " UNION ALL SELECT 'reels', count(*) FROM reels" +
        " UNION ALL SELECT 'stories', count(*) FROM stories" +
        " UNION ALL SELECT 'builders', count(*) FROM builders"
      );
      console.log('\nTable row counts:');
      counts.forEach((r) => console.log('  ' + r.tbl + ': ' + r.count + ' rows'));

      client.release();
      await pool.end();
      console.log('\nDone!');
      return;
    } catch (err) {
      console.log('Failed:', err.message);
      await pool.end().catch(() => {});
    }
  }

  console.error('\nAll connection attempts failed.');
  process.exit(1);
})();