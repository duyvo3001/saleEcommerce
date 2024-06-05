"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartController = void 0;
const success_response_1 = require("../core/success.response");
const cart_service_1 = require("../services/cart.service");
class cartController {
}
exports.cartController = cartController;
_a = cartController;
/*
    * @desc add to cart user
    * @param {int} userId
    * @param {*} res
    * @param {*} next
    * @method POST
    * @url /v1/api/cart/user
*/
cartController.addToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "",
        metadata: yield cart_service_1.CartService.addTocart(req.body)
    }).send(res);
});
cartController.updateToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "",
        metadata: cart_service_1.CartService.addTocartV2(req.body)
    }).send(res);
});
cartController.deleteToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "",
        metadata: cart_service_1.CartService.deleteUserCart(req.body)
    }).send(res);
});
//# sourceMappingURL=cart.Controller.js.map