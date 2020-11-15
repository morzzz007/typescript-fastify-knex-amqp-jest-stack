import { db } from '../config';

module.exports = {
  client: 'pg',
  connection: db.pgConnectionString,
  pool: {
    min: db.poolMin,
    max: db.poolMax,
    acquireTimeoutMillis: 5 * 60 * 1000,
    createTimeoutMillis: 5 * 60 * 1000
  },
  migrations: {
    extension: 'ts',
    directory: db.migrationDirectory
  }
};
