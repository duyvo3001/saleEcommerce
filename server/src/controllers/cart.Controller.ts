import { NextFunction, Request, Response } from "express"
import { CREATED, SuccessResponse } from "../core/success.response";
import { CartService } from "../services/cart.service";
import { parse } from "path";

export class cartController {
    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static addToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "",
            metadata: await CartService.addTocart(req.body)
        }).send(res)
    }

    static updateToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "",
            metadata: CartService.addTocartV2(req.body)
        }).send(res)
    }

    static deleteToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "",
            metadata: CartService.deleteUserCart(req.body)
        }).send(res)
    }

    // listToCart = async (req: Request, res: Response, next: NextFunction) => {
    //     new SuccessResponse({
    //         message: "",
    //         metadata: CartService.getListUsersCart(req.params)
    //     }).send(res)
    // }
}