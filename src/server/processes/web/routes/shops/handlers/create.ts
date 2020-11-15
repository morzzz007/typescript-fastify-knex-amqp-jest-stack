import { FastifyRequest } from 'fastify';
import ShopsRepository from '../../../../../repositories/shops';

export interface ICreateShopBody {
  hostname: string;
  token: string;
}

export const createShopHandler = async function (
  request: FastifyRequest<{ Body: ICreateShopBody }>
): Promise<{ success: boolean }> {
  const { hostname, token } = request.body;
  const shopsRepository = new ShopsRepository();

  await shopsRepository.create(hostname, token);

  return { success: true };
};
