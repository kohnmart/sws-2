var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// overview.ts
import express from 'express';
import { checkHostExists } from '../middleware/host';
import { addCanvasQuery, getAllCanvasQuery } from '../db/setup';
const indexRouter = express.Router();
// Define a route for the overview page
indexRouter.get('/', checkHostExists, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile('index.html', { root: 'public' });
}));
indexRouter.get('/all-canvas', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasList = yield getAllCanvasQuery();
    if (canvasList) {
        res.status(200).json({ list: canvasList });
    }
    res.status(400).json({ message: 'Cant fetch canvas list' });
}));
indexRouter.post('/create', checkHostExists, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const canvasId = yield addCanvasQuery(req.params.host_id);
    if (canvasId) {
        return res.redirect(`/canvas/${canvasId}`);
    }
    return res.status(400).json({ msg: 'error on canvas creation' });
}));
export default indexRouter;
