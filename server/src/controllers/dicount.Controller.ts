import { Types } from "mongoose";
import { CREATED, SuccessResponse } from "../core/success.response";
import { DiscountService } from "../services/discount.services";
import { NextFunction, Request, Response } from "express"

export class DiscountController {

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static createDiscountCode = async (req: Request, res: Response, next: NextFunction) => {
        const { code, is_active, product_ids, applies_to, name, description, min_order_value, type,
            value, max_value, max_uses, uses_count, max_uses_per_user, userId,
            users_used, limit, page, start_date, end_date } = req.body
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
        new CREATED({
            message: "Created discount success",
            metadata: await DiscountService.createDiscountCode(payload)
        }).send(res)
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static getAllDiscountCodesWithProduct = async (req: Request, res: Response, next: NextFunction) => {
        const { code, shopId, userId, limit, page } = req.query

        const payload = {
            code: code as string,
            shopId: new Types.ObjectId(shopId as string),
            userId: userId as string,
            limit: Number(limit),
            page: Number(page)
        }

        new SuccessResponse({
            message: "Get token success",
            metadata: await DiscountService.getAllDiscountCodeWithProduct(payload)
        }).send(res)
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static getAllDiscountCodesWithShop = async (req: Request, res: Response, next: NextFunction) => {
        const { shopId, limit, page } = req.query

        const payload = {
            shopId: new Types.ObjectId(shopId as string),
            limit: Number(limit),
            page: Number(page)
        }

        new SuccessResponse({
            message: "Get token success",
            metadata: await DiscountService.getAllDiscountCodesByShop(payload)
        }).send(res)
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static getDiscountAmount = async (req: Request, res: Response, next: NextFunction) => {
        const { codeId, shopId, userId, products } = req.body

        const payload = {
            codeId: codeId as string,
            shopId: new Types.ObjectId(shopId as string),
            userId: userId as string,
            products: products
        }

        new SuccessResponse({
            message: "Get disscount success",
            metadata: await DiscountService.getDiscountAmount(payload)
        }).send(res)
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static DeleteDiscount = async (req: Request, res: Response, next: NextFunction) => {
        const { codeId, shopId, userId, products } = req.body

        const payload = {
            codeId: codeId as string,
            shopId: new Types.ObjectId(shopId as string),
        }

        new SuccessResponse({
            message: "Get token success",
            metadata: await DiscountService.deleteDiscountCode(payload)
        }).send(res)
    }
    
    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static CancelDiscount = async (req: Request, res: Response, next: NextFunction) => {
        const { codeId, shopId, userId } = req.body

        const payload = {
            codeId: codeId as string,
            shopId: new Types.ObjectId(shopId as string),
            userId: userId as string,
        }

        new SuccessResponse({
            message: "Get token success",
            metadata: await DiscountService.cancelDiscountCode(payload)
        }).send(res)
    }
}
