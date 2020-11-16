import { FastifyRequest } from 'fastify';
import ShopsRepository from '../../../../../repositories/shops';

export interface IShopsCreateBody {
  hostname: string;
  token: string;
}

export const shopsCreateSchema = {
  body: {
    type: 'object',
    properties: {
      hostname: { type: 'string' },
      token: { type: 'string' }
    },
    additionalProperties: false,
    required: ['username', 'password']
  }
};

export const shopsCreateHandler = async function (
  request: FastifyRequest<{ Body: IShopsCreateBody }>
): Promise<{ success: boolean }> {
  const { hostname, token } = request.body;
  const shopsRepository = new ShopsRepository();

  await shopsRepository.create(hostname, token);

  return { success: true };
};
