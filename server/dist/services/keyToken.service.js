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
exports.KeyTokenService = void 0;
const keytoken_model_1 = require("../models/keytoken.model");
const mongoose_1 = require("mongoose");
class KeyTokenService {
}
exports.KeyTokenService = KeyTokenService;
_a = KeyTokenService;
KeyTokenService.createKeyToken = (_b) => __awaiter(void 0, [_b], void 0, function* ({ userID, publicKey, privateKey, refreshToken }) {
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
KeyTokenService.findByUserID = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keytoken_model_1.keytokenModel.findOne({ user: new mongoose_1.Types.ObjectId(userId) }).lean();
});
KeyTokenService.removeKeyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keytoken_model_1.keytokenModel.deleteOne({ _id: new mongoose_1.Types.ObjectId(id) });
});
KeyTokenService.findRefreshTokenUsed = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keytoken_model_1.keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
});
KeyTokenService.findRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keytoken_model_1.keytokenModel.findOne({ refreshToken }).lean();
});
KeyTokenService.deleteKeyById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keytoken_model_1.keytokenModel.deleteOne({ user: userId });
});
KeyTokenService.updateRefreshToken = (_c) => __awaiter(void 0, [_c], void 0, function* ({ refreshToken, refreshTokensUsed, userID }) {
    const filter = { user: new mongoose_1.Types.ObjectId(userID) };
    const update = {
        $set: { refreshToken },
        $addToSet: { refreshTokensUsed } // was used to get new token
    };
    return yield keytoken_model_1.keytokenModel.updateOne(filter, update);
});
//# sourceMappingURL=keyToken.service.js.map