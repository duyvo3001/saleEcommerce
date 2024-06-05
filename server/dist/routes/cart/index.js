"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerCart = void 0;
const express_1 = __importDefault(require("express"));
const cart_Controller_1 = require("../../controllers/cart.Controller");
exports.routerCart = express_1.default.Router();
exports.routerCart
    .post('/', cart_Controller_1.cartController.addToCart)
    .post('/update', cart_Controller_1.cartController.updateToCart)
    .delete('/', cart_Controller_1.cartController.deleteToCart);
// .get('/',cartController.addToCart)
//# sourceMappingURL=index.js.map