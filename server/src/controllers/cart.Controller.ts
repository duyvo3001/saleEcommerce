import { NextFunction, Request, Response } from "express"
import { CREATED, SuccessResponse } from "../core/success.response";
import { CartService } from "../services/cart.service";

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

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static updateToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "",
            metadata: await CartService.addTocartV2(req.body)
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
    static deleteToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "",
            metadata: await CartService.deleteUserCart(req.body)
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
    static listToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "get list success",
            metadata: await CartService.getListUsersCart(req.params.id)
        }).send(res)
    }
}