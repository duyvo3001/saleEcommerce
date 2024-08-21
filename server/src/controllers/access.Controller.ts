import { NextFunction, Request, Response } from "express"
import { AccessService } from "../services/access.service"
import { CREATED, SuccessResponse } from "../core/success.response";

export class AccessController {

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static handlerRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Get token success1",
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.headers['x-rtoken-id'] as string,
                user: req.headers.user as string,
                keyStore: req.headers.keyStore as string
            })
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
    static logout = async (req: Request, res: Response, next: NextFunction) => {

        new SuccessResponse({
            message: "logout Success",
            metadata: await AccessService.logout(req)
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
    static login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, refreshToken } = req.body
        console.log( email, password, refreshToken );
        
        new SuccessResponse({
            metadata: await AccessService.login({ email, password, refreshToken })
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
    static signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, roles } = req.body
        new CREATED({
            message: 'Registed OK!',
            metadata: await AccessService.signUp({ name, email, password, roles }),
            options: {
                limit: 10
            }
        }).send(res)
    }
}
