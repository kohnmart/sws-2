import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Create a new instance of SQLite database
const db = new sqlite3.Database('database.db');

// Function to execute a SQL query and return a Promise
const runQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
        console.log(this);
      }
    });
  });
};

// Function to get a single row from the database and return a Promise
const getQuery = (query: string, params: any[] = []): Promise<any> => {
  return new Promise((resolve, reject) => {
    db.get(query, params, function (err, row) {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

//connect
const connectToDatabase = () => {
  return open({
    filename: 'path/to/your/database.db',
    driver: sqlite3.Database,
  });
};

export default { runQuery, getQuery };
export { runQuery, getQuery };
