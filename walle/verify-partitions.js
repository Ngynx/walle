const { Client } = require('pg');

async function verifyPartitionedTable() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'ngynx',
        password: 'ngynx',
        database: 'walledb',
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL\n');

        // Check if table is partitioned
        const partitionCheck = await client.query(`
      SELECT 
        c.relname as table_name,
        CASE 
          WHEN c.relkind = 'p' THEN 'Partitioned Table'
          WHEN c.relkind = 'r' THEN 'Regular Table'
          ELSE 'Other'
        END as table_type,
        pg_get_partkeydef(c.oid) as partition_key
      FROM pg_class c
      WHERE c.relname = 'points'
      AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public');
    `);

        console.log('📊 Table Information:');
        console.log(partitionCheck.rows[0]);
        console.log('');

        // List all partitions
        const partitions = await client.query(`
      SELECT 
        child.relname as partition_name,
        pg_get_expr(child.relpartbound, child.oid) as partition_bounds
      FROM pg_inherits
      JOIN pg_class parent ON pg_inherits.inhparent = parent.oid
      JOIN pg_class child ON pg_inherits.inhrelid = child.oid
      WHERE parent.relname = 'points'
      ORDER BY child.relname;
    `);

        console.log('📋 Partitions:');
        partitions.rows.forEach(row => {
            console.log(`  - ${row.partition_name}: ${row.partition_bounds}`);
        });
        console.log('');

        // Check indexes on the partition
        const indexes = await client.query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'points_2026_02_17'
      ORDER BY indexname;
    `);

        console.log('🔍 Indexes on points_2026_02_17:');
        indexes.rows.forEach(row => {
            console.log(`  - ${row.indexname}`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

verifyPartitionedTable();
