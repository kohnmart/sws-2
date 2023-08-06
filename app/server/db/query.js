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
const runQuery = async (query, params = []) => {
    const db = await connectToDatabase();
    db.run(query, params, function (err) {
        if (err) {
            throw err;
        }
        else {
            console.log(this);
        }
        // Close the database connection after the query has finished executing
        db.close();
    });
};
// Function to get a single row from the database and return a Promise
const getQuery = async (query, params = []) => {
    const db = await connectToDatabase();
    db.all(query, params, function (err, rows) {
        if (err) {
            throw err;
        }
        db.close();
        return rows;
        // Close the database connection after the query has finished executing
    });
};
export default { runQuery, getQuery };
export { runQuery, getQuery };
