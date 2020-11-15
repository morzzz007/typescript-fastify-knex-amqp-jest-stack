import { FastifyInstance } from 'fastify';
import { createShopHandler } from './handlers/create';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post('/create', createShopHandler);
}
