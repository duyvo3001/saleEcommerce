"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const access_Controller_1 = __importDefault(require("../../controllers/access.Controller"));
const routerShop = express_1.default.Router();
routerShop.post('/shop/signup', access_Controller_1.default.signUp);
exports.default = routerShop;
