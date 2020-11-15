import path from 'path';

const getDbConfig = function (nodeEnv?: string): string {
  if (nodeEnv === 'test') {
    let databasePath = '';
    if (process.env.JEST_WORKER_ID) {
      databasePath = `_${process.env.JEST_WORKER_ID}`;
    }
    return `${process.env.DATABASE_TEST_URL}${databasePath}` || '';
  }

  return process.env.DATABASE_URL || '';
};

export const env = process.env.NODE_ENV;

export const db = {
  pgConnectionString: getDbConfig(process.env.NODE_ENV),
  poolMin: Number(process.env.POOL_MIN) || 2,
  poolMax: Number(process.env.POOL_MAX) || 10,
  migrationDirectory: path.normalize(path.join(__dirname, '../db/migrations'))
};
