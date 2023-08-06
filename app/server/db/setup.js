import { v4 as uuidv4 } from 'uuid';
import { getQuery, runQuery } from './query.js';
const createDatabaseQuery = async () => {
    const create_host_query = `
  CREATE TABLE IF NOT EXISTS host (
    host_id    TEXT PRIMARY KEY
);
    `;
    const create_canvas_query = `

  CREATE TABLE IF NOT EXISTS canvas (
      canvas_id   TEXT PRIMARY KEY,
      host_id     TEXT,
      name        TEXT,
      eventstream TEXT,
      FOREIGN KEY(host_id) REFERENCES host(id)
  );
      `;
    try {
        await runQuery(create_host_query);
        await runQuery(create_canvas_query);
        console.log('Successfully created tables');
    }
    catch (error) {
        console.error(error);
    }
};
// Function to add a new canvas to the database
const addCanvasQuery = async (hostId, canvasName) => {
    const query = 'INSERT INTO CANVAS (canvas_id, host_id, name, eventstream) VALUES (?, ? , ? ,?)';
    const res = await runQuery(query, [uuidv4(), hostId, canvasName, '{}']);
    return res;
};
const checkHostExistsQuery = async (hostId) => {
    const query = 'SELECT name FROM host WHERE host_id = ?';
    const row = await getQuery(query, [hostId]);
    return row !== null;
};
const checkCanvasExistsQuery = async (id) => {
    const query = 'SELECT canvas_id FROM canvas WHERE canvas_id = ? AND host_id = ?';
    const row = await getQuery(query, [id]);
    return row !== null;
};
const addHostQuery = async () => {
    const query = 'INSERT INTO host (host_id) VALUES (?) RETURNING host_id';
    const res = await runQuery(query, [uuidv4()]);
    console.log('RES:' + res);
    return res;
};
const getCanvasStreamQuery = async (canvasId) => {
    const query = 'SELECT canvas_id, host_id, eventstream FROM canvas WHERE canvas_id = ?';
    const res = await getQuery(query, [canvasId]);
    return res;
};
const getAllCanvasQuery = async () => {
    const query = 'SELECT * FROM canvas';
    const res = await getQuery(query);
    return res;
};
export default {
    createDatabaseQuery,
    addCanvasQuery,
    checkHostExistsQuery,
    checkCanvasExistsQuery,
    addHostQuery,
    getCanvasStreamQuery,
    getAllCanvasQuery,
};
export { createDatabaseQuery, addCanvasQuery, checkHostExistsQuery, checkCanvasExistsQuery, addHostQuery, getCanvasStreamQuery, getAllCanvasQuery, };
