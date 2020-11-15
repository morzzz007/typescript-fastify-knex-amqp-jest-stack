import dotenv from 'dotenv';
dotenv.config();

import fastify from 'fastify';
import ShopRoutes from './routes/shops';
import { AddressInfo } from 'net';
import db from '../../db';

db.connect();

const server = fastify();

server.get('/', async () => {
  return { hello: 'world' };
});

server.register(ShopRoutes, { prefix: '/shops' });

const start = async () => {
  try {
    await server.listen(3000);
    console.log(`Server listening on ${(server.server.address() as AddressInfo).port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
