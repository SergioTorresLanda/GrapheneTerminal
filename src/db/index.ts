import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import Order from './Order';

// 1. Create the native SQLite adapter
const adapter = new SQLiteAdapter({
  schema,
  // Optional database name or file system path
  // dbName: 'graphene_terminal', 
  jsi: true, /* This is the magic flag that bypasses the old RN Bridge */
  onSetUpError: error => {
    console.error("Database failed to load:", error);
  }
});

// 2. Instantiate the database
export const database = new Database({
  adapter,
  modelClasses: [
    Order,
  ],
});