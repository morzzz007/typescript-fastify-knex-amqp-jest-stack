import knex, { Knex } from 'knex';
import * as knexConfig from './knexfile';

export default class DbConnection {
  static knex: Knex;

  static connect(): void {
    this.knex = knex(knexConfig);
  }
}
