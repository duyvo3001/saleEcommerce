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
exports.checkDiscountExists = exports.findAllDiscountCodesSelect = exports.findAllDiscountCodesUnSelect = void 0;
const productRepo_utils_1 = require("../../utils/productUtils/productRepo.utils");
const findAllDiscountCodesUnSelect = (_a) => __awaiter(void 0, [_a], void 0, function* ({ limit = 50, page = 1, sort = 'ctime', filter, Select_unSelect, model }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documnets = yield model.findOne(filter, null, sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, productRepo_utils_1.unGetSelectData)(Select_unSelect))
        .lean();
    return documnets;
});
exports.findAllDiscountCodesUnSelect = findAllDiscountCodesUnSelect;
const findAllDiscountCodesSelect = (_b) => __awaiter(void 0, [_b], void 0, function* ({ limit = 50, page = 1, sort = 'ctime', filter, Select_unSelect, model }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const documnets = yield model.findOne(filter, null, sortBy)
        .skip(skip)
        .limit(limit)
        .select((0, productRepo_utils_1.unGetSelectData)(Select_unSelect))
        .lean();
    return documnets;
});
exports.findAllDiscountCodesSelect = findAllDiscountCodesSelect;
const checkDiscountExists = (model, filter) => __awaiter(void 0, void 0, void 0, function* () { return yield model.findOne(filter).lean(); });
exports.checkDiscountExists = checkDiscountExists;
//# sourceMappingURL=discount.repo.js.map