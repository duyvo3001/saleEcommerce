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
exports.AccessController = void 0;
const access_service_1 = require("../services/access.service");
const success_response_1 = require("../core/success.response");
class AccessController {
}
exports.AccessController = AccessController;
_a = AccessController;
AccessController.handlerRefreshToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "Get token success",
        metadata: yield access_service_1.AccessService.handlerRefreshToken({
            refreshToken: req.headers['x-rtoken-id'],
            user: req.headers.user,
            keyStore: req.headers.keyStore
        })
    }).send(res);
});
AccessController.logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    new success_response_1.SuccessResponse({
        message: "logout Success",
        metadata: yield access_service_1.AccessService.logout(req)
    }).send(res);
});
AccessController.login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, refreshToken } = req.body;
    new success_response_1.SuccessResponse({
        metadata: yield access_service_1.AccessService.login({ email, password, refreshToken })
    }).send(res);
});
AccessController.signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, roles } = req.body;
    new success_response_1.CREATED({
        message: 'Registed OK!',
        metadata: yield access_service_1.AccessService.signUp({ name, email, password, roles }),
        options: {
            limit: 10
        }
    }).send(res);
});
//# sourceMappingURL=access.Controller.js.map