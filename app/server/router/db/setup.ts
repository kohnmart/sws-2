import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
//connect
async function connectToDatabase() {
  return open({
    filename: 'path/to/your/database.db',
    driver: sqlite3.Database,
  });
}

async function createDatabase() {
  const db = await connectToDatabase();
  await db.exec(`
  
  CREATE TABLE IF NOT EXISTS canvas (
        canvas_id INTEGER PRIMARY KEY,
        host_id INTEGER,
        eventstream TEXT
        FOREIGN KEY(host_id) REFERENCES host(id);
    )
    

    CREATE TABLE IF NOT EXISTS host (
        id INTEGER PRIMARY KEY
        name TEXT
    )

    `);

  await db.close();
  console.log('Canvas table created successfully.');
}

async function addHost(hostId: string) {
  const db = await connectToDatabase();
  await db.run('INSERT INTO host (id) VALUES (?) RETUNRING id', [hostId]);
}

async function addCanvas(hostId: string) {
  const db = await connectToDatabase();
  const canvasId = uuidv4();
  const eventStream = JSON.stringify('');
  // Insert the new canvas into the database
  await db.run('INSERT INTO canvas (id, eventstream) VALUES (?, ?)', [
    canvasId,
    eventStream,
  ]);

  // Return the ID of the newly inserted canvas
  return canvasId;
}

export default { createDatabase, addCanvas };
export { createDatabase, addCanvas };
