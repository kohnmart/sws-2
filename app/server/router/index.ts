import express from 'express';
import { checkHostExists } from '../middleware/host.js';
import { addCanvasQuery, getAllCanvasQuery } from '../db/query.js';
const indexRouter = express.Router();

indexRouter.get('/all-canvas', async (req, res) => {
  const canvasList = await getAllCanvasQuery();
  if (canvasList) {
    res.json({ status: 200, content: canvasList });
  } else {
    res.json({ status: 400, content: 'Cannot fetch canvas list' });
  }
});

indexRouter.post('/create', checkHostExists, async (req, res) => {
  const canvasId = await addCanvasQuery(req.body.hostId, req.body.name);
  if (canvasId) {
    return res.json({
      status: 200,
      content: {
        name: req.body.name,
        hostId: req.body.hostId,
        canvasId: canvasId,
      },
    });
  }
  return res.json({ status: 400, content: 'error on canvas creation' });
});

export default indexRouter;
