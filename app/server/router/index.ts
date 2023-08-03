// overview.ts
import express from 'express';
import { checkHostExists } from '../middleware/host';
import { addCanvasQuery, getAllCanvasQuery } from '../db/setup';
const indexRouter = express.Router();

// Define a route for the overview page
indexRouter.get('/', checkHostExists, async (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

indexRouter.get('/all-canvas', async (req, res) => {
  const canvasList = await getAllCanvasQuery();
  if (canvasList) {
    res.status(200).json({ list: canvasList });
  }
  res.status(400).json({ message: 'Cant fetch canvas list' });
});

indexRouter.post('/create', checkHostExists, async (req, res) => {
  const canvasId = await addCanvasQuery(req.params.host_id);
  if (canvasId) {
    return res.redirect(`/canvas/${canvasId}`);
  }
  return res.status(400).json({ msg: 'error on canvas creation' });
});

export default indexRouter;
