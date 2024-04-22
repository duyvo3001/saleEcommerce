"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_Controller_1 = __importDefault(require("../../controllers/access.Controller"));
const checkAuth_1 = require("../../auth/checkAuth");
const routerShop = express_1.default.Router();
routerShop.post('/shop/signup', (0, checkAuth_1.asyncHandler)(access_Controller_1.default.signUp));
routerShop.post('/shop/login', (0, checkAuth_1.asyncHandler)(access_Controller_1.default.login));
// authentication //
routerShop.post('/shop/login', (0, checkAuth_1.asyncHandler)(access_Controller_1.default.login));
exports.default = routerShop;
//# sourceMappingURL=index.js.map