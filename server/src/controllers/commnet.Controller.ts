import { NextFunction, Request, Response } from "express"
import { CREATED, SuccessResponse } from "../core/success.response";
import { CommentService } from "../services/comment.service";
import { Types } from "mongoose";

export class commentControler {

    /*
     * @add comment
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @method POST
     * @url /v1/api/commnet/
 */
    static createComment = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: "Create comment successfully",
            metadata: await CommentService.createComment(req.body)
        }).send(res)
    }

    /*
     * @get comment
     * @param {*} req
     * @param {*} res
     * @param {*} next
     * @method GET
     * @url /v1/api/commnet/
 */
    static getComment = async (req: Request, res: Response, next: NextFunction) => {
        const { productId, parentCommentId, limit, offset } = req.query

        const payload = {
            productId: new Types.ObjectId(productId as string),
            parentCommentId: parentCommentId,
            limit: Number(limit),
            offset: Number(offset)
        }

        new SuccessResponse({
            message: "Get comment successfully",
            metadata: await CommentService.getCommentByParentId(payload)
        }).send(res)
    }
}