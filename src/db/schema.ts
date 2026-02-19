import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'symbol', type: 'string', isIndexed: true },
        { name: 'price', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'side', type: 'string' },
        { name: 'timestamp', type: 'number', isIndexed: true },
      ]
    }),
  ]
});