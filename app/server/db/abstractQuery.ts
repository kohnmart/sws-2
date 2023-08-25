import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create a new instance of SQLite database
// const db = new sqlite3.Database('./app/server/db/database.db');
const connectToDatabase = async () => {
  return open({
    filename: './app/server/db/database.db',
    driver: sqlite3.Database,
  });
};

const runQuery = async (query: string, params: any[] = []): Promise<any> => {
  const db = await connectToDatabase();
  try {
    const result = await db.run(query, params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    // Close the database connection after the query has finished executing
    db.close();
  }
};

// Function to get a single row from the database and return a Promise
const getQuery = async (query: string, params: any[] = []) => {
  const db = await connectToDatabase();
  try {
    const result = await db.all(query, params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    // Close the database connection after the query has finished executing
    db.close();
  }
};

export default { runQuery, getQuery };
export { runQuery, getQuery };
