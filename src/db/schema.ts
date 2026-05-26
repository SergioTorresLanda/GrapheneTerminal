import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'orders',
      columns: [
        { name: 'symbol', type: 'string', isIndexed: true }, //O(log N) vs. O(N) 
        { name: 'price', type: 'number' },
        { name: 'amount', type: 'number' },
        { name: 'total', type: 'number' },
        { name: 'side', type: 'string' },
        { name: 'timestamp', type: 'number', isIndexed: true },
      ]
    }),
  ]
});

//this schema dictates exactly how the underlying native database (SQLite) 
//allocates, structures, and indexes that data on disk.


