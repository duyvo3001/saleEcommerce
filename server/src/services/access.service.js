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
const shop_model_1 = __importDefault(require("../models/shop.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const keyToken_service_1 = __importDefault(require("./keyToken.service"));
const authUtils_1 = __importDefault(require("../auth/authUtils"));
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
};
class AccessService {
    constructor() {
        this.signUp = (_a) => __awaiter(this, [_a], void 0, function* ({ name, email, password, roles }) {
            try {
                const holderShop = yield shop_model_1.default.findOne({ email }).lean();
                if (holderShop) {
                    return {
                        code: '20002',
                        message: 'Shop already exists'
                    };
                }
                const passwordHash = yield bcrypt_1.default.hash(password, 10);
                const newShop = yield shop_model_1.default.create({
                    name, email, password: passwordHash, roles: [RoleShop.SHOP]
                });
                if (newShop) { //create prikey and pubkey
                    const { privateKey, publicKey } = (0, crypto_1.generateKeyPairSync)('rsa', {
                        modulusLength: 2048, // the length of your key in bits
                    });
                    console.log(privateKey, publicKey);
                    const publicKeyString = yield keyToken_service_1.default.createKeyToken({
                        userID: newShop._id.toString(),
                        publicKey: publicKey.toString()
                    });
                    if (!publicKeyString) {
                        return {
                            code: 'xxxx',
                            message: 'publicKeyString error'
                        };
                    }
                    const token = yield keyToken_service_1.default.createKeyToken({
                        userID: newShop._id.toString(),
                        publicKey: publicKey.toString()
                    });
                    //create token pair 
                    const tokens = yield (0, authUtils_1.default)({
                        userID: newShop._id, email
                    }, publicKey.toString(), privateKey.toString());
                    console.log('create token success :', tokens);
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
            }
            catch (error) {
                return {
                    code: '20001',
                    message: error.message,
                    status: 'error',
                };
            }
        });
    }
}
exports.default = new AccessService();
