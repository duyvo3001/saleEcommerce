import { NextFunction, Request, Response } from "express"
import accessService from "../services/access.service";
import { CREATED, SuccessResponse } from "../core/success.response";

class AcessController {
    logout = async (req: Request, res: Response, next: NextFunction) => {

        new SuccessResponse({
            message: "logout Success",
            metadata: await accessService.logout(req)
        }).send(res)
    }
    login = async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, refreshToken } = req.body

        new SuccessResponse({
            metadata: await accessService.login({ email, password, refreshToken })
        }).send(res)
    }
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, roles } = req.body
        new CREATED({
            message: 'Registed OK!',
            metadata: await accessService.signUp({ name, email, password, roles }),
            options: {
                limit: 10
            }
        }).send(res)
    }
}

export default new AcessController()