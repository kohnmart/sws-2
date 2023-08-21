// overview.ts
import express from 'express';
import { deleteCanvasQuery } from '../db/query.js';
import { canvasExists } from '../middleware/canvas.js';
const canvasRouter = express.Router();

canvasRouter.get('/:id', canvasExists, async (req, res) => {
  res.json({ status: 400 });
});

canvasRouter.delete('/:id', canvasExists, async (req, res) => {
  try {
    await deleteCanvasQuery(req.params.id);
    res.json({ status: 200, content: { id: req.params.id } });
  } catch {
    console.log('Error on delete...');
  }
});

export default canvasRouter;
