// overview.ts
import express from 'express';
import { checkCanvasExistsQuery, deleteCanvas } from '../db/query.js';
const canvasRouter = express.Router();
canvasRouter.get('/:id', async (req, res) => {
    const exists = await checkCanvasExistsQuery(req.params.id);
    if (exists) {
        res.json({ status: 200 });
    }
    else {
        res.status(404).send('Canvas not found');
    }
});
canvasRouter.get('/remove/:id', async (req, res) => {
    const exists = await checkCanvasExistsQuery(req.params.id);
    if (exists) {
        try {
            await deleteCanvas(req.params.id);
            console.log(req.params.id);
            res.json({ status: 200, id: req.params.id });
        }
        catch {
            console.log('Error on delete...');
        }
    }
    else {
        res.status(404).send('Canvas not found');
    }
});
export default canvasRouter;
