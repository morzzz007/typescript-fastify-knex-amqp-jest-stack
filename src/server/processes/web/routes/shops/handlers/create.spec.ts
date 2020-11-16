import { FastifyRequest } from 'fastify';
import { shopsCreateHandler, IShopsCreateBody } from './create';
import ShopsRepository from '../../../../../repositories/shops';

jest.mock('../../../../../repositories/shops');

describe('CreateShopHandler', () => {
  test('should call shopsRepository create with given params', async () => {
    const request = {
      body: {
        hostname: 'a',
        token: 'b'
      }
    } as FastifyRequest<{ Body: IShopsCreateBody }>;

    await shopsCreateHandler(request);

    const shopsRepositoryInstance = (ShopsRepository as jest.Mock).mock.instances[0];

    expect(shopsRepositoryInstance.create.mock.calls[0]).toEqual(['a', 'b']);
  });

  test('should return with success', async () => {
    const request = {
      body: {
        hostname: 'a',
        token: 'b'
      }
    } as FastifyRequest<{ Body: IShopsCreateBody }>;

    const response = await shopsCreateHandler(request);

    expect(response.success).toBeTruthy();
  });
});
