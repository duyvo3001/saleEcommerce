import { Types } from "mongoose"
import { InventoryModels } from "../inventory.model"

type Inventory = { product_id: Types.ObjectId, shop_id: Types.ObjectId, stock: number, location: string }


export const insertInventory = async ({
    product_id, shop_id, stock, location
}: Inventory) => {
    return await InventoryModels.create({
        inventory_productId: product_id,
        inventory_location: location,
        inventory_Stock: stock,
        inventory_shopId: shop_id,
    })
}