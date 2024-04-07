"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const router = express_1.default.Router();
router.use('/v1/api', access_1.default);
// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).json({
//         message: "hello diiii"
//     })
// })
exports.default = router;
