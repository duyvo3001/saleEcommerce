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
exports.insertInventory = void 0;
const inventory_model_1 = require("../inventory.model");
const insertInventory = (_a) => __awaiter(void 0, [_a], void 0, function* ({ product_id, shop_id, stock, location }) {
    return yield inventory_model_1.InventoryModels.create({
        inventory_productId: product_id,
        inventory_location: location,
        inventory_Stock: stock,
        inventory_shopId: shop_id,
    });
});
exports.insertInventory = insertInventory;
//# sourceMappingURL=inventory.repo.js.map