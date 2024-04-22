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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByEmail = void 0;
const shop_model_1 = require("../models/shop.model");
const findByEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, select = {
    email: 1, password: 2, name: 1, roles: 1
} }) {
    return yield shop_model_1.shopModel.findOne({ email }).select(select).lean();
});
exports.findByEmail = findByEmail;
//# sourceMappingURL=shop.service.js.map