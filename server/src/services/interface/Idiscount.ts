import { Types } from "mongoose";

type DiscountCode = {
    code: string;
    start_date: Date;
    end_date: Date;
    is_active: boolean;
    shopId: Types.ObjectId;
    min_order_value: Number;
    product_ids: [];
    applies_to: string;
    name: string;
    description: string;
    type: string;
    value: number;
    max_value: number;
    max_uses: number;
    uses_count: number;
    max_uses_per_user: number;
    userId: string;
    users_used: Types.ObjectId;
};
/*
    ? get fields you want to display
*/
interface IGetAllDiscountCode extends Pick<DiscountCode, 'code' | 'userId' | 'shopId'> {
    limit: number;
    page: number;
}
interface IGetAllDiscountCodeByShop extends Pick<DiscountCode, 'shopId'> {
    limit: number;
    page: number;
}
interface IDiscountAmount extends Pick<DiscountCode, 'shopId' | 'userId'> {
    codeId: string;
    products: [{
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }
    ];
}
interface IDiscountCode extends Pick<DiscountCode, 'shopId'> {
    codeId: string;
}
interface IcancelDiscountCode extends Pick<DiscountCode, 'shopId' | 'userId'> {
    codeId: string;
}

export {
    DiscountCode,
    IGetAllDiscountCode,
    IGetAllDiscountCodeByShop,
    IDiscountAmount,
    IDiscountCode,
    IcancelDiscountCode,
}