// overview.ts
import express from 'express';
import { checkHostExists } from '../middleware/host.js';
import {
  addCanvasQuery,
  checkCanvasExistsQuery,
  createDatabaseQuery,
  getAllCanvasQuery,
} from '../db/setup.js';
const canvasRouter = express.Router();

canvasRouter.get('/:id', async (req, res) => {
  const exists = await checkCanvasExistsQuery(req.params.id);
  if (exists) {
    return res.redirect(req.url);
  } else {
    return res.redirect('/');
  }
});

export default canvasRouter;
