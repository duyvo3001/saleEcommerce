import { Types } from "mongoose";

interface Un_Or_publishProductByShop {
    product_shop: Types.ObjectId;
    product_id: Types.ObjectId;
}
;
type filterFindAllProduct = { isPublish: boolean; } | { isPublish: boolean; product_shop: Types.ObjectId; } | { isPublish: boolean; _id: any; };
interface IfindAllProduct {
    limit: number;
    sort: string;
    page: number;
    filter: filterFindAllProduct;
    select: string[];
}
interface IfindProductRepo {
    product_id: string;
    unSelect: string[];
}

interface IupdateProductById {
    product_id: string;
    bodyUpdate: {};
    model: any;
    isNew: boolean;
}

export {
    IupdateProductById, IfindAllProduct, Un_Or_publishProductByShop, IfindProductRepo
}
