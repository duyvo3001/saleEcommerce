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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // accesstoken
        const accessToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7 days"
        });
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: "7 days"
        });
        //
        jsonwebtoken_1.default.verify(payload.toString(), privateKey, (err, decode) => {
            if (err)
                console.log(`error verify`, err);
            else
                console.log(`decode verify`, decode);
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
    }
});
exports.default = createTokenPair;
