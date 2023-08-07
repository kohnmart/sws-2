import { runQuery } from './abstractQuery.js';

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
  } catch (error) {
    console.error(error);
  }
};

export default {
  createDatabaseQuery,
};
export { createDatabaseQuery };
