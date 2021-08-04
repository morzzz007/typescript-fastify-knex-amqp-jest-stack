/* eslint-disable @typescript-eslint/no-non-null-assertion */
import path from 'path';

const getDbConfig = function (
  nodeEnv?: string
): { user: string; host: string; database: string; password: string; port: number } {
  let database = nodeEnv === 'test' ? process.env.POSTGRES_DATABASE_TEST! : process.env.POSTGRES_DATABASE!;

  if (process.env.JEST_WORKER_ID) {
    database = `${database}_${process.env.JEST_WORKER_ID}`;
  }

  const port = nodeEnv === 'test' ? Number(process.env.POSTGRES_PORT_TEST!) : Number(process.env.POSTGRES_PORT!);

  return {
    user: process.env.POSTGRES_USER || '',
    host: process.env.POSTGRES_HOST || '',
    database,
    password: process.env.POSTGRES_PASSWORD || '',
    port
  };
};

const getSslConfig = function (nodeEnv?: string) {
  if (nodeEnv !== 'production') {
    return {};
  }

  return {
    ssl: {
      rejectUnauthorized: process.env.POSTGRES_REJECT_UNAUTHORIZED === 'true',
      ca: Buffer.from(process.env.POSTGRES_SERVER_CA!, 'base64').toString('utf-8').trim(),
      key: Buffer.from(process.env.POSTGRES_CLIENT_KEY!, 'base64').toString('utf-8').trim(),
      cert: Buffer.from(process.env.POSTGRES_CLIENT_CERT!, 'base64').toString('utf-8').trim(),
      servername: process.env.POSTGRES_SERVERNAME
    }
  };
};

export const env = process.env.NODE_ENV;

export const db = {
  connection: {
    ...getDbConfig(process.env.NODE_ENV),
    ...getSslConfig(process.env.NODE_ENV)
  },
  poolMin: Number(process.env.POOL_MIN) || 2,
  poolMax: Number(process.env.POOL_MAX) || 10,
  migrationDirectory: path.normalize(path.join(__dirname, '../db/migrations'))
};
