import { Types } from "mongoose";
import { SuccessResponse } from "../core/success.response";
import { DiscountService } from "../services/discount.services";
import { NextFunction, Request, Response } from "express"

export class DiscountController {

    static createDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
        const { code, is_active, product_ids, applies_to, name, description, min_order_value, type, value, max_value, max_uses, uses_count, max_uses_per_user, userId, users_used, limit, page, start_date, end_date } = req.body
        const payload = {
            code,
            start_date,
            end_date,
            is_active,
            shopId: new Types.ObjectId(req.headers['x-client-id']?.toString()),
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user,
            userId,
            users_used,
        }
        new SuccessResponse({
            message: "Created Success",
            metadata: await DiscountService.createDiscountCode(payload)
        }).send(res)
    }

    static getAllDiscountCodes = async (req: Request, res: Response, next: NextFunction) => {
        const { code, shopId, userId, limit, page } = req.body
        const payload = {
            code, shopId, userId, limit, page
        }
        new SuccessResponse({
            message: "Get token success",
            metadata: await DiscountService.getAllDiscountCodeWithProduct(payload)
        }).send(res)
    }
    
}
