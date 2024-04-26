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
exports.verifyJWT = exports.authentication = exports.createTokenPair = void 0;
const asyncHandler_1 = require("../helpers/asyncHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_response_1 = require("../core/error.response");
const keyToken_service_1 = __importDefault(require("../services/keyToken.service"));
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    keyStore: 'keyStore',
    REFRESHTOKEN: "refreshtoken",
    user: 'user'
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
// export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
//     /*
//         1 - check userId missing 
//         2 - get accessToken 
//         3 - verify Token
//         4 - check user in db 
//         5 - check keyStore with this userId
//         6 - ok all  => return next()
//     */
//     //#1
//     const userIdREQ = req.headers[HEADER.CLIENT_ID]?.toString()
//     if (!userIdREQ || "") throw new AuthFailedError('invalid Request')
//     //#2
//     const keyStore = await keyTokenService.findByUserID(userIdREQ)
//     if (!keyStore || "") throw new NotFoundError('Not found keystore')
//     //#3 
//     const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString()
//     if (!accessToken || "") throw new AuthFailedError('invalid Request')
//     try {//#4
//         const User: UserIDJwtPayload = jwt.verify(accessToken, keyStore.publicKey) as UserIDJwtPayload
//         if (userIdREQ !== User.userID) throw new AuthFailedError('invalid userId')//#5
//         req.headers[HEADER.keyStore] = keyStore?._id
//         return next()//#6
//     } catch (error) {
//         throw error
//     }
// })
exports.authentication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    /*
        1 - check userId missing
        2 - get accessToken
        3 - verify Token
        4 - check user in db
        5 - check keyStore with this userId
        6 - ok all  => return next()
    */
    //#1
    const userIdREQ = (_a = req.headers[HEADER.CLIENT_ID]) === null || _a === void 0 ? void 0 : _a.toString();
    if (!userIdREQ || "")
        throw new error_response_1.AuthFailedError('invalid Request');
    //#2
    const keyStore = yield keyToken_service_1.default.findByUserID(userIdREQ);
    if (!keyStore || "")
        throw new error_response_1.NotFoundError('Not found keystore');
    //#3S
    const refreshToken = (_b = req.headers[HEADER.REFRESHTOKEN]) === null || _b === void 0 ? void 0 : _b.toString();
    if (refreshToken) {
        try {
            const DecodeUser = jsonwebtoken_1.default.verify(refreshToken, keyStore.privateKey);
            if (userIdREQ !== DecodeUser.userID)
                throw new error_response_1.AuthFailedError('invalid userId'); //#5
            req.headers[HEADER.keyStore] = keyStore === null || keyStore === void 0 ? void 0 : keyStore._id;
            req.headers[HEADER.REFRESHTOKEN] = keyStore === null || keyStore === void 0 ? void 0 : keyStore.refreshToken;
            req.headers[HEADER.user] = DecodeUser.toString();
            return next(); //#6
        }
        catch (error) {
            throw error;
        }
    }
    const accessToken = (_c = req.headers[HEADER.AUTHORIZATION]) === null || _c === void 0 ? void 0 : _c.toString();
    if (!accessToken || "")
        throw new error_response_1.AuthFailedError('invalid Request');
    try { //#4
        const User = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userIdREQ !== User.userID)
            throw new error_response_1.AuthFailedError('invalid userId'); //#5
        req.headers[HEADER.keyStore] = keyStore === null || keyStore === void 0 ? void 0 : keyStore._id;
        return next(); //#6
    }
    catch (error) {
        throw error;
    }
}));
const verifyJWT = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return yield jsonwebtoken_1.default.verify(token, keySecret);
});
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=authUtils.js.map