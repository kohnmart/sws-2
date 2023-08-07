import { Request, Response, NextFunction } from 'express';
import { checkHostExistsQuery, addHostQuery } from '../db/query.js';

const checkHostExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const hostId: string = req.body.hostId;
  console.log(hostId);
  try {
    if (hostId) {
      const hostExists = await checkHostExistsQuery(hostId);
      if (!hostExists) {
        const id = await addHostQuery();
        req.body.hostId = id;
        console.log(req.body.hostId);
      }
    } else {
      const id = await addHostQuery();
      req.body.hostId = id;
      console.log('TEST');
      console.log(req.body.hostId);
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};
export default { checkHostExists };
export { checkHostExists };
