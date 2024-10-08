import { Types } from "mongoose";
import { BadRequestError } from "../core/error.response";
import { InventoryModels } from "../models/inventory.model";
import { getProductById } from "../models/repositories/product.repo";


interface Iinventory {
    stock: any,
    productId: Types.ObjectId,
    shopId: Types.ObjectId,
    location: string
}

export class InventoryService {
    static async addStocktoInventory({ stock, productId, shopId, location }: Iinventory) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError(`The product dose not exist`)
        }

        const query = { inventory_shopId: shopId, inventory_productId: productId }
        const updateSet = {
            $inc: {
                inventory_stock: stock
            },
            $set: {
                inventory_location: location
            }
        }
        const options = {
            upset: true, new: true
        }

        return await InventoryModels.findOneAndUpdate(query, updateSet, options)
    }
}


