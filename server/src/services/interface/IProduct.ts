import { Types, Schema } from "mongoose";

interface IProduct {
    product_name: String;
    product_thump: String;
    product_description: String;
    product_Price: number;
    product_quantity: number;
    product_type: [String];
    product_shop: Types.ObjectId;
    product_attributes: Schema.Types.Mixed;
}
interface InterfaceFindProduct extends Pick<IProduct, 'product_shop'> {
    limit: number;
    skip: number;
}
interface IpublishProductShop extends Pick<IProduct, 'product_shop'> {
    product_id: Types.ObjectId;
}

export {
    IProduct,
    InterfaceFindProduct,
    IpublishProductShop,
}