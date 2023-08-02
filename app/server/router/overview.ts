// overview.ts
import express from 'express';
import { addCanvas } from './db/setup.js';
const indexRouter = express.Router();

// Define a route for the overview page
indexRouter.get('/', function (req, res) {
  res.sendFile('index.html', { root: 'public' });
});

indexRouter.post('/create-canvas', async (req, res) => {
  // Redirect the user to the newly created canvas page
  const hostId = '';
  const id = await addCanvas(hostId);
  if (id !== '') {
    res.redirect(`/canvas/${id}`);
  } else {
    res.redirect('/');
  }
});

export default indexRouter;
