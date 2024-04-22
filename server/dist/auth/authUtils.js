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
exports.authentication = exports.createTokenPair = void 0;
const asyncHandler_1 = require("../helpers/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_response_1 = require("../core/error.response");
const keyToken_service_1 = __importDefault(require("../services/keyToken.service"));
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    objKey: 'objKey'
};
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    // accesstoken 
    const accessToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '1h'
    });
    // refreshtoken 
    const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: '12h'
    });
    jsonwebtoken_1.default.verify(accessToken, publicKey, (err, decode) => {
        if (err)
            console.log(`error verify`, err);
        else
            console.log(`decode verify`, decode);
    });
    return { accessToken, refreshToken };
});
exports.createTokenPair = createTokenPair;
exports.authentication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify Token
        4 - check user in db
        5 - check keyStore with this userId
        6 - ok all  => return next()
    */
    //#1
    const userId = (_a = req.headers[HEADER.CLIENT_ID]) === null || _a === void 0 ? void 0 : _a.toString();
    if (!userId || "")
        throw new error_response_1.AuthFailedError('invalid Request');
    //#2
    const keyStore = yield keyToken_service_1.default.findByUserID(userId);
    if (!keyStore || "")
        throw new error_response_1.NotFoundError('Not found keystore');
    //#3 
    const accessToken = (_b = req.headers[HEADER.AUTHORIZATION]) === null || _b === void 0 ? void 0 : _b.toString();
    console.log("accessToken~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", accessToken);
    if (!accessToken || "")
        throw new error_response_1.AuthFailedError('invalid Request');
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser)
            throw new error_response_1.AuthFailedError('invalid userId');
        // req.keyStore = keyStore 
        return next();
    }
    catch (error) {
        throw error;
    }
}));
//# sourceMappingURL=authUtils.js.map