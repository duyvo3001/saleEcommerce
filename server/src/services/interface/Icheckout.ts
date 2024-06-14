import { Types } from "mongoose";

interface IcheckoutReview {
    cartId: Types.ObjectId;
    userId: string;
    shop_order_ids: Array<Ishop_order_ids_news>;
}
interface IOrder extends Pick<IcheckoutReview, 'cartId' | 'userId'> {
    shop_order_ids: Array<Ishop_order_ids_news>;
    user_address: string;
    user_payment: string;
}
interface Ishop_order_ids_news {
    shopId: Types.ObjectId;
    shop_discount: Array<Ishop_discount>;
    item_products: Array<Iitem_products>;
}
interface Ishop_discount {
    shopId: Types.ObjectId;
    discountId: Types.ObjectId;
    codeId: string;
}
interface Iitem_products {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}

export {
    IcheckoutReview,
    IOrder,
    Ishop_order_ids_news,
    Ishop_discount,
    Iitem_products,
}
