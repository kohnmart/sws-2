// overview.ts
import express from 'express';
import { checkCanvasExistsQuery } from '../db/query.js';
const canvasRouter = express.Router();

canvasRouter.get('/:id', async (req, res) => {
  const exists = await checkCanvasExistsQuery(req.params.id);
  if (exists) {
    res.sendFile('canvas.html', { root: 'app/canvas' });
  } else {
    res.status(404).send('Canvas not found');
  }
});

export default canvasRouter;
