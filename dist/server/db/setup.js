var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import { getQuery, runQuery } from './query';
const createDatabaseQuery = () => __awaiter(void 0, void 0, void 0, function* () {
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
    yield runQuery(query);
});
// Function to add a new canvas to the database
const addCanvasQuery = (host_id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO CANVAS (canvas_id, host_id, eventstream) VALUES (?, ?) RETURING id';
    const res = yield runQuery(query, [uuidv4(), host_id, '{}']);
    return res;
});
const checkHostExistsQuery = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT name FROM host WHERE id = ?';
    const row = yield getQuery(query, [id]);
    return row !== null;
});
const addHostQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'INSERT INTO host (id) VALUES (?) RETURNING id';
    const res = yield runQuery(query, [uuidv4()]);
    return res;
});
const getCanvasStreamQuery = (canvasId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'SELECT canvas_id, host_id, eventstream FROM canvas WHERE canvas_id = ?';
    const res = yield getQuery(query, [canvasId]);
    return res;
});
const getAllCanvasQuery = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = 'canvas_id, host_id FROM canvas';
    const res = yield getQuery(query);
    return res;
});
export default {
    createDatabaseQuery,
    addCanvasQuery,
    checkHostExistsQuery,
    addHostQuery,
    getCanvasStreamQuery,
    getAllCanvasQuery,
};
export { createDatabaseQuery, addCanvasQuery, checkHostExistsQuery, addHostQuery, getCanvasStreamQuery, getAllCanvasQuery, };
