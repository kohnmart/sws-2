// overview.ts
import express from 'express';
import { checkHostExists } from '../middleware/host.js';
import { addCanvasQuery, getAllCanvasQuery } from '../db/setup.js';
const indexRouter = express.Router();

indexRouter.get('/all-canvas', async (req, res) => {
  const canvasList = await getAllCanvasQuery();
  if (canvasList) {
    res.status(200).json({ list: canvasList });
  }
  res.status(400).json({ message: 'Cant fetch canvas list' });
});

indexRouter.post('/create', checkHostExists, async (req, res) => {
  const canvasId = await addCanvasQuery(req.body.host_id, req.body.name);
  if (canvasId) {
    return res.redirect(`/canvas/${canvasId}`);
  }
  return res.status(400).json({ msg: 'error on canvas creation' });
});

export default indexRouter;
