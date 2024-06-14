import { Types } from "mongoose";

export interface Inventory {
    product_id: Types.ObjectId;
    shop_id: Types.ObjectId;
    stock: number;
    location: string;
}

export interface IreservationInventory {
    productId: Types.ObjectId;
    quantity: number;
    cartId: Types.ObjectId;
}
