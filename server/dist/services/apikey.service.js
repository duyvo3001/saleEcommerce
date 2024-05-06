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
exports.findById = void 0;
const apikey_model_1 = require("../models/apikey.model");
const findById = (key) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        ! when in production mode turn code
    */
    // const newKey = await apikeyModel.create(
    //     { key: randomBytes(64).toString('hex'), status: true, permissions: ['0000'] }
    // )
    // console.log('hello_______________-------', newKey)
    const objKey = yield apikey_model_1.apikeyModel.findOne({ key, status: true }).lean();
    return objKey;
});
exports.findById = findById;
//# sourceMappingURL=apikey.service.js.map