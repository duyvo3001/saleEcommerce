import { NextFunction, Request, Response } from "express"
import { SuccessResponse } from "../../core/success.response";
import { notificationService } from "../../services/notification.service";

export class NotificationController {

     /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/notification/user
    */
     static listNotiByUser = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "noti successfully added",
            metadata: await notificationService.listNotiByUser(req.body)
        }).send(res);
    }
}