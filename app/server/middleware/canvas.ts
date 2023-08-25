import { Request, Response, NextFunction } from 'express';
import { checkCanvasExistsQuery } from '../db/query.js';

const canvasExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const exists = await checkCanvasExistsQuery(req.params.id);
    if (exists) {
      next();
    } else {
      res
        .status(404)
        .json({ message: 'Canvas does not exist with this ID...' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export default { canvasExists };
export { canvasExists };
