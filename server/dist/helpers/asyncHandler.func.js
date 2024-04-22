"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncHandler = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = AsyncHandler;
//# sourceMappingURL=asyncHandler.func.js.map