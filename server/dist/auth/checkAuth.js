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
exports.asyncHandler = exports.permissions = exports.apiKey = void 0;
const apikey_service_1 = require("../services/apikey.service");
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'aithorization',
    objKey: 'objKey'
};
const apiKey = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const headers = new Headers();
        const key = (_a = req.headers[HEADER.API_KEY]) === null || _a === void 0 ? void 0 : _a.toString();
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error1'
            });
        }
        ;
        //check objKey
        const objKey = yield (0, apikey_service_1.findById)(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error2'
            });
        }
        ;
        req.headers[HEADER.objKey] = JSON.stringify(objKey);
        return next();
    }
    catch (error) {
    }
});
exports.apiKey = apiKey;
const permissions = (permissions) => {
    return (req, res, next) => {
        var _a, _b;
        const _objPermission = ((_a = req.headers[HEADER.objKey]) === null || _a === void 0 ? void 0 : _a.toString()) || "undefined";
        const jsonObject = JSON.parse(_objPermission);
        if (!(jsonObject === null || jsonObject === void 0 ? void 0 : jsonObject.permissions)) {
            return res.status(403).json({
                message: 'permissions denied 1'
            });
        }
        ;
        const validPermissions = (_b = jsonObject.permissions) === null || _b === void 0 ? void 0 : _b.includes(permissions);
        if (!validPermissions) {
            return res.status(403).json({
                message: 'permissions denied 2'
            });
        }
        ;
        next();
    };
};
exports.permissions = permissions;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=checkAuth.js.map