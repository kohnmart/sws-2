import { checkHostExistsQuery, addHostQuery } from '../db/setup.js';
const checkHostExists = async (req, res, next) => {
    const host_id = req.params.host_id;
    try {
        const hostExists = await checkHostExistsQuery(host_id);
        if (!hostExists) {
            const id = await addHostQuery();
            req.params.host_id = id;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};
export default { checkHostExists };
export { checkHostExists };
