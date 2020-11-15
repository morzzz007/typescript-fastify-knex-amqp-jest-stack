import ShopsRepository from './shops';
import db from '../db';

describe('Shops Repository', () => {
  describe('create', () => {
    test('should save a new row in db', async () => {
      const shopsRepository = new ShopsRepository();

      await shopsRepository.create('test-hostname', 'token');

      const result = await db.knex('shops').where({ hostname: 'test-hostname' });

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({ hostname: 'test-hostname', token: 'token' });
    });
  });

  describe('getByHostname', () => {
    test('should return saved shop', async () => {
      const shopsRepository = new ShopsRepository();
      await shopsRepository.create('test-hostname', 'token');

      const result = await shopsRepository.getByHostname('test-hostname');

      expect(result).toMatchObject({ hostname: 'test-hostname', token: 'token', customerId: null });
    });

    test('should throw error if shop not found', async () => {
      const shopsRepository = new ShopsRepository();

      let caughtError;
      try {
        await shopsRepository.getByHostname('test-hostname');
      } catch (error) {
        caughtError = error;
      }

      expect(caughtError).toBeInstanceOf(Error);
      expect(caughtError).toHaveProperty('message', 'Shop not found!');
    });
  });
});
