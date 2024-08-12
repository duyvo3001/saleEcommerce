import { NextFunction, Request, Response } from "express"
import { SuccessResponse } from "../core/success.response"
import { checkOutService } from "../services/checkout.service"

export class checkoutController {
    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static CheckOutReview = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "checkout review successfully",
            metadata: await checkOutService.checkoutReview(req.body)
        }).send(res)
    }

    static OrderByUser = async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: "order by user successfully",
            metadata: await checkOutService.orderByUser(req.body)
        }).send(res)
    }
}