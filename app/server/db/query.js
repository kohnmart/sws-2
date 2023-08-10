import { v4 as uuidv4 } from 'uuid';
import { getQuery, runQuery } from './abstractQuery.js';
// Function to add a new canvas to the database
const addCanvasQuery = async (hostId, canvasName) => {
    const query = 'INSERT INTO CANVAS (canvas_id, host_id, name, eventstream) VALUES (?, ? , ? ,?)';
    const res = await runQuery(query, [uuidv4(), hostId, canvasName, '{}']);
    return res;
};
const checkHostExistsQuery = async (hostId) => {
    const query = 'SELECT host_id FROM host WHERE host_id = ?';
    const row = await getQuery(query, [hostId]);
    return row !== null;
};
const checkCanvasExistsQuery = async (id) => {
    const query = 'SELECT canvas_id FROM canvas WHERE canvas_id = ? AND host_id = ?';
    const row = await getQuery(query, [id]);
    return row !== null;
};
const addHostQuery = async () => {
    const query = 'INSERT INTO host (host_id) VALUES (?)';
    const id = uuidv4();
    await runQuery(query, [id]);
    return id;
};
const getCanvasStreamQuery = async (canvasId) => {
    const query = 'SELECT canvas_id, host_id, eventstream FROM canvas WHERE canvas_id = ?';
    const res = await getQuery(query, [canvasId]);
    return res;
};
const deleteCanvas = async (canvasId) => {
    const query = 'DELETE FROM canvas WHERE canvas_id = ?';
    const res = await getQuery(query, [canvasId]);
    return res;
};
const getAllCanvasQuery = async () => {
    const query = 'SELECT * FROM canvas';
    const res = await getQuery(query);
    return res;
};
export default {
    addCanvasQuery,
    checkHostExistsQuery,
    checkCanvasExistsQuery,
    addHostQuery,
    getCanvasStreamQuery,
    getAllCanvasQuery,
    deleteCanvas,
};
export { addCanvasQuery, checkHostExistsQuery, checkCanvasExistsQuery, addHostQuery, getCanvasStreamQuery, getAllCanvasQuery, deleteCanvas, };
