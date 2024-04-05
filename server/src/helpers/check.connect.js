"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverload = exports.conuntConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const process_1 = __importDefault(require("process"));
const _SECONDS = 10000;
// check number connections in db
const conuntConnect = () => {
    const numConnections = mongoose_1.default.connections.length;
    console.log("number of connection ", numConnections);
    return numConnections;
};
exports.conuntConnect = conuntConnect;
const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose_1.default.connections.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process_1.default.memoryUsage().rss;
        const maxConnections = numCores * 5;
        // console.log("Active connections: ", numConnections)
        // console.log("Memory usage: ", memoryUsage/1024/1024 , " : MB")
        if (numConnections > maxConnections) {
            console.log("max connections overload");
            // send mail ... function
        }
    }, _SECONDS);
};
exports.checkOverload = checkOverload;
