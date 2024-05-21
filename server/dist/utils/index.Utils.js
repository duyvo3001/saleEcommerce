"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToObjectMongoDB = void 0;
const mongoose_1 = require("mongoose");
const convertToObjectMongoDB = (id) => new mongoose_1.Types.ObjectId(id);
exports.convertToObjectMongoDB = convertToObjectMongoDB;
//# sourceMappingURL=index.Utils.js.map