import { Types } from "mongoose";

type filterFindAllProdut = {
    discount_is_active: boolean;
}|
{
    discount_is_active: boolean;
    discount_shopId: Types.ObjectId;
}|
{
    discount_is_active: boolean;
    discount_shopId: any;
};
export interface findAlldiscountCode {
    limit: number;
    page: number;
    sort: string;
    filter: filterFindAllProdut;
    Select_unSelect: string[];
    model: any;
};
