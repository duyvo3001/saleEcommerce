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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const access_service_1 = __importDefault(require("../services/access.service"));
const success_response_1 = require("../core/success.response");
class AcessController {
    constructor() {
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { email, password, refreshToken } = req.body;
            new success_response_1.SuccessResponse({
                metadata: yield access_service_1.default.login({ email, password, refreshToken })
            }).send(res);
        });
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, roles } = req.body;
            new success_response_1.CREATED({
                message: 'Registed OK!',
                metadata: yield access_service_1.default.signUp({ name, email, password, roles }),
                options: {
                    limit: 10
                }
            }).send(res);
        });
    }
}
exports.default = new AcessController();
//# sourceMappingURL=access.Controller.js.map