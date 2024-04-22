'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const check_connect_1 = require("../helpers/check.connect");
const config_mongodb_1 = __importDefault(require("../config/config.mongodb"));
// const connectString =`mongodb+srv://${config.db.name}:${config.db.pass}@${config.db.host}.tzjnjep.mongodb.net/${config.db.dbName}?retryWrites=true&w=majority`!
const connectString = `mongodb+srv://${config_mongodb_1.default.db.name}:${config_mongodb_1.default.db.pass}@${config_mongodb_1.default.db.host}.tzjnjep.mongodb.net/${config_mongodb_1.default.db.dbName}?retryWrites=true&w=majority&appName=${config_mongodb_1.default.db.name}`;
class Database {
    constructor() {
        this.connect();
    }
    connect() {
        mongoose_1.default.connect(connectString, { maxPoolSize: +process.env.MONGO_MAX_POOL_SIZE })
            .then(() => {
            console.log('Connected to MongoDB Successfully :  ');
        }, check_connect_1.conuntConnect)
            .catch((err) => console.log('Error Connecting to MongoDB:', err));
        mongoose_1.default.connection.db;
        // Example of setting mongoose debug options
        if (process.env.NODE_ENV === 'dev') {
            mongoose_1.default.set('debug', true);
        }
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongodb = Database.getInstance();
exports.default = instanceMongodb;
//# sourceMappingURL=init.mongodb.js.map