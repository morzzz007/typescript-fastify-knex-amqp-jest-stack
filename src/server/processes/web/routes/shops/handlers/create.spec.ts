import { FastifyRequest } from 'fastify';
import { createShopHandler, ICreateShopBody } from './create';
import ShopsRepository from '../../../../../repositories/shops';

jest.mock('../../../../../repositories/shops');

describe('CreateShopHandler', () => {
  test('should call shopsRepository create with given params', async () => {
    const request = {
      body: {
        hostname: 'a',
        token: 'b'
      }
    } as FastifyRequest<{ Body: ICreateShopBody }>;

    await createShopHandler(request);

    const shopsRepositoryInstance = (ShopsRepository as jest.Mock).mock.instances[0];

    expect(shopsRepositoryInstance.create.mock.calls[0]).toEqual(['a', 'b']);
  });

  test('should return with success', async () => {
    const request = {
      body: {
        hostname: 'a',
        token: 'b'
      }
    } as FastifyRequest<{ Body: ICreateShopBody }>;

    const response = await createShopHandler(request);

    expect(response.success).toBeTruthy();
  });
});
