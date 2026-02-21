const { Client } = require('pg');

async function verifyTimescale() {
  const client = new Client({
    host: process.env.TIMESCALE_HOST || process.env.POSTGRES_HOST || 'localhost',
    port: Number(process.env.TIMESCALE_PORT || process.env.POSTGRES_PORT || 6432),
    user: process.env.TIMESCALE_USER || process.env.POSTGRES_USER || 'ngynx',
    password:
      process.env.TIMESCALE_PASSWORD || process.env.POSTGRES_PASSWORD || 'ngynx',
    database: process.env.TIMESCALE_DB || process.env.POSTGRES_DB || 'walledb_timescale',
  });

  try {
    await client.connect();
    console.log('Connected to Timescale/PostgreSQL');

    const hypertableResult = await client.query(`
      SELECT hypertable_name, num_dimensions, num_chunks
      FROM timescaledb_information.hypertables
      WHERE hypertable_name = 'points_timescale';
    `);

    console.log('\nHypertable:');
    if (hypertableResult.rows.length === 0) {
      console.log('  points_timescale is not registered as hypertable.');
    } else {
      console.log(hypertableResult.rows[0]);
    }

    const indexesResult = await client.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE tablename = 'points_timescale'
      ORDER BY indexname;
    `);

    console.log('\nIndexes:');
    indexesResult.rows.forEach((row) => console.log(`  - ${row.indexname}`));

    const retentionJobs = await client.query(`
      SELECT proc_name, schedule_interval, config
      FROM timescaledb_information.jobs
      WHERE proc_name = 'policy_retention'
        AND hypertable_name = 'points_timescale';
    `);

    const compressionJobs = await client.query(`
      SELECT proc_name, schedule_interval, config
      FROM timescaledb_information.jobs
      WHERE proc_name = 'policy_compression'
        AND hypertable_name = 'points_timescale';
    `);

    console.log('\nRetention policy:');
    if (retentionJobs.rows.length === 0) {
      console.log('  none (infinite retention).');
    } else {
      console.log(retentionJobs.rows[0]);
    }

    console.log('\nCompression policy:');
    if (compressionJobs.rows.length === 0) {
      console.log('  none.');
    } else {
      console.log(compressionJobs.rows[0]);
    }
  } catch (error) {
    console.error('Verification failed:', error.message);
  } finally {
    await client.end();
  }
}

verifyTimescale();
