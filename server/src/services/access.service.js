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
const shop_model_1 = require("../models/shop.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
const authUtils_1 = require("../auth/authUtils");
const error_response_1 = require("../core/error.response");
const shop_service_1 = require("./shop.service");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
    constructor() {
        //1_ check email
        //2_ match pass
        //3_ create At and rt and save 
        //4_ generate tokens
        //5_ get data return login
        this.login = (_a) => __awaiter(this, [_a], void 0, function* ({ email, password, refreshToken }) {
            let select = {};
            console.log(email, password, refreshToken);
            const foundShop = yield (0, shop_service_1.findByEmail)({ email, select }); //1
            if (!foundShop)
                throw new error_response_1.BadRequestError(`shop not Registered`);
            const match = yield bcrypt_1.default.compare(password, foundShop.password); //2
            if (match == false || !match)
                throw new error_response_1.AuthFailedError(`Authentication Failed`);
            const { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            });
            const tokens = yield (0, authUtils_1.createTokenPair)(//4
            {
                userID: foundShop._id, email
            }, publicKey, privateKey);
            yield keyToken_service_1.default.createKeyToken({
                userID: foundShop._id,
                privateKey, publicKey,
                refreshToken: tokens.refreshToken
            });
            return {
                shop: foundShop, tokens
            };
        });
        this.signUp = (_b) => __awaiter(this, [_b], void 0, function* ({ name, email, password, roles }) {
            const holderShop = yield shop_model_1.shopModel.findOne({ email }).lean(); // find shop 
            if (holderShop) {
                throw new error_response_1.BadRequestError('Error: Shop already Registered');
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 10); // hash pass
            const newShop = yield shop_model_1.shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            });
            if (newShop) { //create prikey and pubkey
                const { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'spki',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs8',
                        format: 'pem'
                    }
                });
                const publicKeyString = yield keyToken_service_1.default.createKeyToken({
                    userID: newShop._id.toString(),
                    publicKey: publicKey.toString(),
                    privateKey: privateKey.toString(),
                    refreshToken: ""
                });
                if (!publicKeyString || publicKeyString == undefined) {
                    return {
                        code: 'xxxx',
                        message: 'publicKeyString error'
                    };
                }
                //create token pair 
                const tokens = yield (0, authUtils_1.createTokenPair)({
                    userID: newShop._id, email
                }, publicKeyString.toString(), privateKey.toString());
                if (!tokens || tokens == undefined) {
                    return {
                        code: 'xxxx',
                        message: 'tokens error'
                    };
                }
                return {
                    code: 201,
                    metadata: {
                        shop: newShop,
                        tokens
                    }
                };
            }
            return {
                code: 202,
                metadata: null
            };
        });
    }
}
exports.default = new AccessService();
