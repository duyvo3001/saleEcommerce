"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const dev = {
    app: {
        port: parseInt(process.env.DEV_APP_PORT || '8080', 10),
    },
    db: {
        host: process.env.DEV_DB_HOST_MONGODB,
        pass: process.env.DEV_PASSWORD_MONGODB,
        name: process.env.DEV_USERNAME_MONGODB,
    },
};
const product = {
    app: {
        port: parseInt(process.env.PRO_APP_PORT || '8080', 10),
    },
    db: {
        host: process.env.PRO_DB_HOST_MONGODB,
        pass: process.env.PRO_PASSWORD_MONGODB,
        name: process.env.PRO_USERNAME_MONGODB,
    },
};
const config = { dev, product };
const env = process.env.NODE_ENV || "dev";
exports.default = config[env];
