import { Types } from "mongoose";

type addtocart = { userId: Types.ObjectId; product: {}; };
type product = { productId: Types.ObjectId; quantity: Number; };
interface cart {
    item_products: item_products;
    shopId: String;
}
interface item_products {
    productId: Types.ObjectId;
    quantity: number;
    old_quantity: number;
}
interface IaddTocart {
    userId: Types.ObjectId;
    product: product;
}
interface IUpdateCart {
    userId: Types.ObjectId;
    shop_order_ids: Array<cart>;
}
interface IdeleteCart {
    userId: Number;
    productId: Types.ObjectId;
}

export {
    addtocart,
    product,
    IaddTocart,
    IUpdateCart,
    IdeleteCart,
}