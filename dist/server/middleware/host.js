var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { checkHostExistsQuery, addHostQuery } from '../db/setup';
const checkHostExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const host_id = req.params.host_id;
    try {
        const hostExists = yield checkHostExistsQuery(host_id);
        if (!hostExists) {
            const id = yield addHostQuery();
            req.params.host_id = id;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default { checkHostExists };
export { checkHostExists };
