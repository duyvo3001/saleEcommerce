import { NextFunction, Request, Response } from "express"
import accessService from "../services/access.service";

class AcessController {
    signUp = async (req : Request ,res : Response,next : NextFunction)=>{
        try {
            console.log(`[P]::signUp`,req.body)
            const {name ,email ,password ,roles} = req.body
            return res.status(201).json(await accessService.signUp({name ,email ,password ,roles}));
        } catch (error) {
            next(error);
        }
    }
} 

export default new AcessController()