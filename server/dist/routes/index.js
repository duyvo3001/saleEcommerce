"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_1 = __importDefault(require("./access"));
const product_1 = __importDefault(require("./product"));
const checkAuth_1 = require("../auth/checkAuth");
const router = express_1.default.Router();
//check apiKey
router.use(checkAuth_1.apiKey);
//check permissions
router.use((0, checkAuth_1.permissions)('0000'));
router.use('/v1/api', access_1.default)
    .use('/v1/api/product', product_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map