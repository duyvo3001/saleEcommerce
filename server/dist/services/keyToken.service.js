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
const mongoose_1 = require("mongoose");
class KeyTokenService {
    constructor() {
        this.createKeyToken = (_a) => __awaiter(this, [_a], void 0, function* ({ userID, publicKey, privateKey, refreshToken }) {
            try {
                const update = {
                    publicKey, privateKey, refreshTokenUsed: [], refreshToken
                };
                const filter = { user: userID };
                const options = { upsert: true, new: true };
                const tokens = yield keytoken_model_1.keytokenModel.findOneAndUpdate(filter, update, options);
                return tokens ? tokens.publicKey : null;
            }
            catch (error) {
                return error;
            }
        });
        this.findByUserID = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield keytoken_model_1.keytokenModel.findOne({ user: new mongoose_1.Types.ObjectId(userId) }).lean();
        });
        this.removeKeyById = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield keytoken_model_1.keytokenModel.deleteOne({ _id: new mongoose_1.Types.ObjectId(id) });
        });
        this.findRefreshTokenUsed = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            return yield keytoken_model_1.keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
        });
        this.findRefreshToken = (refreshToken) => __awaiter(this, void 0, void 0, function* () {
            return yield keytoken_model_1.keytokenModel.findOne({ refreshToken }).lean();
        });
        this.deleteKeyById = (userId) => __awaiter(this, void 0, void 0, function* () {
            return yield keytoken_model_1.keytokenModel.deleteOne({ user: userId });
        });
        this.updateRefreshToken = (_b) => __awaiter(this, [_b], void 0, function* ({ refreshToken, refreshTokensUsed, userID }) {
            const filter = { user: new mongoose_1.Types.ObjectId(userID) };
            const update = {
                $set: { refreshToken },
                $addToSet: { refreshTokensUsed } // was used to get new token
            };
            return yield keytoken_model_1.keytokenModel.updateOne(filter, update);
        });
    }
}
exports.default = new KeyTokenService();
//# sourceMappingURL=keyToken.service.js.map