import { v4 as uuidv4 } from 'uuid';
import { getQuery, runQuery } from './query';

const createDatabaseQuery = async () => {
  const query = `
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
    `;

  await runQuery(query);
};

// Function to add a new canvas to the database
const addCanvasQuery = async (host_id: string): Promise<string> => {
  const query =
    'INSERT INTO CANVAS (canvas_id, host_id, eventstream) VALUES (?, ?) RETURING id';
  const res = await runQuery(query, [uuidv4(), host_id, '{}']);
  return res;
};

const checkHostExistsQuery = async (id: string): Promise<boolean> => {
  const query = 'SELECT name FROM host WHERE id = ?';
  const row = await getQuery(query, [id]);
  return row !== null;
};

const addHostQuery = async (): Promise<string> => {
  const query = 'INSERT INTO host (id) VALUES (?) RETURNING id';
  const res = await runQuery(query, [uuidv4()]);
  return res;
};

const getCanvasStreamQuery = async (canvasId: string): Promise<any> => {
  const query =
    'SELECT canvas_id, host_id, eventstream FROM canvas WHERE canvas_id = ?';
  const res = await getQuery(query, [canvasId]);
  return res;
};

const getAllCanvasQuery = async (): Promise<any> => {
  const query = 'canvas_id, host_id FROM canvas';
  const res = await getQuery(query);
  return res;
};

export default {
  createDatabaseQuery,
  addCanvasQuery,
  checkHostExistsQuery,
  addHostQuery,
  getCanvasStreamQuery,
  getAllCanvasQuery,
};
export {
  createDatabaseQuery,
  addCanvasQuery,
  checkHostExistsQuery,
  addHostQuery,
  getCanvasStreamQuery,
  getAllCanvasQuery,
};
