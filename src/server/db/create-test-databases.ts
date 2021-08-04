import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config';
import os from 'os';
import { Client } from 'pg';

const cpuCount = os.cpus() ? os.cpus().length : 1;

const defaultDbName = db.connection.database;

const getConnection = function (databaseName: string) {
  return {
    ...db.connection,
    database: databaseName
  };
};

const recreateTestDbs = async () => {
  const client = new Client(getConnection('template1'));

  await client.connect();

  for (let index = 0; index <= cpuCount; index++) {
    console.log(`Creating test database ${index}`);
    try {
      const pgUser = process.env.POSTGRES_USER || 'developer';
      await client.query(`DROP DATABASE IF EXISTS ${defaultDbName}_${index}`);
      await client.query(`CREATE DATABASE ${defaultDbName}_${index} TEMPLATE ${defaultDbName}`);
      await client.query(`ALTER DATABASE ${defaultDbName}_${index} OWNER TO ${pgUser}`);
    } catch (error) {
      console.log(error.message);
      await client.end();
      process.exit(1);
    }
  }
  await client.end();
};

const getLatestMigrationId = async (databaseName: string) => {
  const client = new Client(getConnection(databaseName));
  await client.connect();

  let result;

  try {
    result = await client.query('SELECT MAX(id) FROM knex_migrations');
  } catch (error) {
    console.log(`Migrations not found in ${databaseName ? databaseName : defaultDbName}...`);
    await client.end();
    throw error;
  }

  await client.end();
  return result.rows[0].max;
};

const isRecreationNeeded = async () => {
  try {
    const [mainMigrationId, secondaryMigrationId] = await Promise.all([
      getLatestMigrationId(defaultDbName),
      getLatestMigrationId(`${defaultDbName}_${cpuCount}`)
    ]);

    return mainMigrationId !== secondaryMigrationId;
  } catch (error) {
    return true;
  }
};

(async () => {
  const recreate = await isRecreationNeeded();

  if (recreate) {
    await recreateTestDbs();
  } else {
    console.log('Everything is fine, using previously generated dbs...');
  }
  process.exit(0);
})();
