import dotenv from 'dotenv';
dotenv.config();

import { db } from '../config';
import os from 'os';
import url from 'url';
import { Client } from 'pg';

const cpuCount = os.cpus() ? os.cpus().length : 1;

const defaultDbPath = url.parse(db.pgConnectionString).path;

if (defaultDbPath === null) {
  process.exit(1);
}

const defaultDbName = defaultDbPath.substr(1);

const recreateTestDbs = async () => {
  const client = new Client({
    connectionString: db.pgConnectionString.replace(defaultDbPath, '/template1')
  });

  await client.connect();

  for (let index = 0; index <= cpuCount; index++) {
    console.log(`Creating test database ${index}`);
    try {
      await client.query(`DROP DATABASE IF EXISTS ${defaultDbName}_${index}`);
      await client.query(`CREATE DATABASE ${defaultDbName}_${index} TEMPLATE ${defaultDbName}`);
      await client.query(`ALTER DATABASE ${defaultDbName}_${index} OWNER TO postgres`);
    } catch (error) {
      console.log(error.message);
      await client.end();
      process.exit(1);
    }
  }
  await client.end();
};

const getLatestMigrationId = async (databaseName: string | undefined) => {
  const finalConnectionString = databaseName ?
    db.pgConnectionString.replace(defaultDbPath, `/${databaseName}`) :
    db.pgConnectionString;

  const client = new Client({
    connectionString: finalConnectionString
  });

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
      getLatestMigrationId(undefined),
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
    process.exit(0);
  }
})();
