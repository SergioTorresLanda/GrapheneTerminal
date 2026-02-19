import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export default class Order extends Model {
  static table = 'orders';

  // The @field decorator maps the class property to the SQLite column
  @field('symbol') symbol!: string;
  @field('price') price!: number;
  @field('amount') amount!: number;
  @field('total') total!: number;
  @field('side') side!: 'buy' | 'sell';
  @field('timestamp') timestamp!: number;
}