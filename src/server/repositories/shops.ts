import { Knex } from 'knex';
import connection from '../db';

export interface Shop {
  hostname: string;
  token: string;
  customerId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export default class ShopsRepository {
  db: Knex;

  constructor() {
    this.db = connection.knex;
  }

  create(hostname: string, token: string): Promise<void> {
    return this.db('shops').insert({ hostname, token });
  }

  async getByHostname(hostname: string): Promise<Shop> {
    const result = await this.db('shops').where({ hostname }).first();

    if (!result) {
      throw new Error('Shop not found!');
    }

    return {
      hostname: result.hostname,
      token: result.token,
      customerId: result.customer_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at
    };
  }
}
