import { checkHostExistsQuery, addHostQuery } from '../db/setup.js';
const checkHostExists = async (req, res, next) => {
    const hostId = req.body.hostId;
    try {
        if (hostId) {
            const hostExists = await checkHostExistsQuery(hostId);
            if (!hostExists) {
                const id = await addHostQuery();
                req.body.hostId = id;
                console.log(req.body.hostId);
            }
        }
        else {
            const id = await addHostQuery();
            req.body.hostId = id;
            console.log(req.body.hostId);
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export default { checkHostExists };
export { checkHostExists };
