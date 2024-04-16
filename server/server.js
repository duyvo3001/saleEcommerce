"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./src/app");
var config_mongodb_1 = require("./src/config/config.mongodb");
var PORT = config_mongodb_1.default.app.port;
var server = app_1.default.listen(PORT, function () {
    console.log('server listening on ', PORT);
});
process.on('SIGINT', function () {
    server.close(function () { return console.log('server closed'); });
});
