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
const keytoken_model_1 = require("../models/keytoken.model");
class KeyTokenService {
    constructor() {
        this.createKeyToken = (_a) => __awaiter(this, [_a], void 0, function* ({ userID, publicKey, privateKey, refreshToken }) {
            try {
                const filter = { user: userID }, update = {
                    publicKey, privateKey, refreshTokenUsed: [], refreshToken
                }, options = { upset: true, new: true };
                const tokens = yield keytoken_model_1.keytokenModel.findOneAndUpdate(filter, update, options);
                return tokens ? tokens.publicKey : null;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = new KeyTokenService();
