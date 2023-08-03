// overview.ts
import express from 'express';
import { checkHostExists } from '../middleware/host';
import { addCanvasQuery } from '../db/setup';
const indexRouter = express.Router();

// Define a route for the overview page
indexRouter.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'public' });
});

indexRouter.post('/create-canvas', checkHostExists, async (req, res) => {
  const canvasId = await addCanvasQuery(req.params.host_id);
  if (canvasId) {
    return res.redirect(`/canvas/${canvasId}`);
  }
  return res.status(400).json({ msg: 'error on canvas creation' });
});

export default indexRouter;
