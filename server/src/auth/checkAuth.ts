import { Request, Response, NextFunction } from "express"
import { findById } from "../services/apikey.service"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    objKey: 'objKey'
}
declare global {
    namespace Express {
        interface Request {
            objKey?: {
                permissions?: string[];
            };
        }
    }
}
export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const headers = new Headers();
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error1'
            })
        };
        //check objKey
        const objKey = await findById(key);

        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error2'
            })
        };

        req.headers[HEADER.objKey] = JSON.stringify(objKey)

        return next()
    } catch (error) {
        
    }
}

export const permissions = (permissions: string) => {

    return (req: Request, res: Response, next: NextFunction) => {

        const _objPermission: string = req.headers[HEADER.objKey]?.toString() || "undefined"
        const jsonObject = JSON.parse(_objPermission);

        if (!jsonObject?.permissions) {
            return res.status(403).json({
                message: 'permissions denied 1'
            })
        };

        const validPermissions = jsonObject.permissions?.includes(permissions)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'permissions denied 2'
            })
        };

        next()
    }
}

