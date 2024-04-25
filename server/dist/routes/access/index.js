"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_Controller_1 = __importDefault(require("../../controllers/access.Controller"));
const asyncHandler_1 = require("../../helpers/asyncHandler");
const authUtils_1 = require("../../auth/authUtils");
const routerShop = express_1.default.Router();
routerShop.post('/shop/signup', (0, asyncHandler_1.asyncHandler)(access_Controller_1.default.signUp));
routerShop.post('/shop/login', (0, asyncHandler_1.asyncHandler)(access_Controller_1.default.login));
// authentication //
routerShop.use(authUtils_1.authentication);
routerShop.post('/shop/logout', (0, asyncHandler_1.asyncHandler)(access_Controller_1.default.logout));
routerShop.post('/shop/handlerRefreshToken', (0, asyncHandler_1.asyncHandler)(access_Controller_1.default.handlerRefreshToken));
exports.default = routerShop;
//# sourceMappingURL=index.js.map