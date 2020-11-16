import { FastifyInstance } from 'fastify';
import { shopsCreateHandler, shopsCreateSchema } from './handlers/create';

export default async function (fastify: FastifyInstance): Promise<void> {
  fastify.post('/create', { schema: shopsCreateSchema }, shopsCreateHandler);
}
