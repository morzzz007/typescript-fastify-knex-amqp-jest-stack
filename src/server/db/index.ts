import knex from 'knex';
import * as knexConfig from './knexfile';

export default class DbConnection {
  static knex: knex;

  static connect(): void {
    this.knex = knex(knexConfig);
  }
}
