"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const PORT = 8000;
const server = app_1.default.listen(PORT, () => {
    console.log('server listening on ', PORT);
});
process.on('SIGINT', () => {
    server.close(() => console.log('server closed'));
});
