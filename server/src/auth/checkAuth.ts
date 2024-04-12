import { Request, Response, NextFunction } from "express"
import { findById } from "../services/apikey.service"

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'aithorization'
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
        const headers = new Headers();
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error1'
            })
        };
        //check objKey
        const objKey = findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error2'
            })
        };
        req.headers['objKey'] = await objKey.toString();
        return next()
    } catch (error) {

    }
}

export const permissions = (permissions: string) => {

    return (req: Request, res: Response, next: NextFunction) => {
        if (req.objKey?.permissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        };

        console.log('permissions ::', req.objKey)
        const validPermissions = req.objKey?.permissions?.includes(permissions)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'permissions denied'
            })
        };

        next()
    }
}

