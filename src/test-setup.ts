import dotenv from 'dotenv';
dotenv.config();

import db from './server/db';
db.connect();

beforeEach(async () => {
  await db.knex.raw('TRUNCATE shops');
});

afterAll(() => {
  return db.knex.destroy();
});
