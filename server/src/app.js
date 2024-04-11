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
const init_mongodb_1 = __importDefault(require("./dbs/init.mongodb"));
const check_connect_1 = require("./helpers/check.connect");
const routes_1 = __importDefault(require("./routes"));
exports.app = (0, express_1.default)();
//init middleware
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use((0, helmet_1.default)());
exports.app.use((0, compression_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
//init db .
try {
    init_mongodb_1.default;
}
catch (error) {
    (error) => {
        console.error(error);
        process.exit(1);
    };
}
(0, check_connect_1.checkOverload)();
//init middleware
//init routes
exports.app.use('/', routes_1.default);
//handle errors
// module.exports = app
exports.default = exports.app;