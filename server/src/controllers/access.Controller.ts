import { NextFunction, Request, Response } from "express"
import accessService from "../services/access.service";
import { CREATED } from "../core/success.response";

class AcessController {
    signUp = async (req: Request, res: Response, next: NextFunction) => {

        const { name, email, password, roles } = req.body

        new CREATED({
            message: 'Registed OK!',
            metadata: await accessService.signUp({ name, email, password, roles }),
            options:{
                limit :10
            }
        }).send(res)
    }
}

export default new AcessController()