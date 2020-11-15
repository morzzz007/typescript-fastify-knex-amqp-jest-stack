import dotenv from 'dotenv';
dotenv.config();

import db from './index';

db.connect();

const knex = db.knex;

knex.migrate
  .latest()
  .then(() => knex.migrate.currentVersion())
  .then((currentVersion) => {
    console.log('Current version: ', currentVersion);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
