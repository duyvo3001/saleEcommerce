import { Types } from "mongoose"
import { InventoryModels } from "../inventory.model"
import { Interface } from "readline"

type Inventory = { product_id: Types.ObjectId, shop_id: Types.ObjectId, stock: number, location: string }

export interface IreservationInventory {
    productId: Types.ObjectId,
    quantity: number,
    cartId: Types.ObjectId,
}
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

const reservationInventory = async ({ productId, quantity, cartId }: IreservationInventory) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }
    const options = {
        upsert: true, new: true
    }

    return await InventoryModels.updateOne(query, updateSet, options)
}

export {
    reservationInventory
}