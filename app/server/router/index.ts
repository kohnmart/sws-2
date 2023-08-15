import express from 'express';
import { checkHostExists } from '../middleware/host.js';
import { addCanvasQuery, getAllCanvasQuery } from '../db/query.js';
const indexRouter = express.Router();

indexRouter.get('/all-canvas', async (req, res) => {
  const canvasList = await getAllCanvasQuery();
  if (canvasList) {
    res.json({ status: 200, list: canvasList });
  } else {
    res.json({ status: 400, message: 'Cannot fetch canvas list' });
  }
});

indexRouter.post('/create', checkHostExists, async (req, res) => {
  const canvasId = await addCanvasQuery(req.body.hostId, req.body.name);
  if (canvasId) {
    return res.status(200).json({
      msg: {
        name: req.body.name,
        hostId: req.body.hostId,
        canvasId: canvasId,
      },
    });
  }
  return res.status(400).json({ msg: 'error on canvas creation' });
});

export default indexRouter;
