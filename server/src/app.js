"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
exports.app = (0, express_1.default)();
//init middleware
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, compression_1.default)());
//init db 
//init middleware
exports.app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "hello diiii"
    });
});
//handle errors
// module.exports = app
exports.default = exports.app;
