import { query } from 'express';
import { Types } from "mongoose";
import { NotFoundError } from "../core/error.response";
import { CommentModel } from "../models/comment.model";
import { Icomment, IGetComment } from "./interface/Icomment";


/*
    key features: Comment service
    + add comment [user,shop]
    + get a list of comments [user,shop]
    + delete a comment [user,shop,admin]
*/
export class CommentService {

    static async createComment({
        productId, userId, content, parentCommentId
    }: Icomment) {

        console.log(productId, userId, content, parentCommentId)
        const comment = new CommentModel({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue = 0

        if (parentCommentId) {

            const parentComment = await CommentModel.findById(parentCommentId)
            if (!parentComment) throw new NotFoundError(`parent comment not found`)

            rightValue = parentComment.comment_right

            // update many comments_right
            await CommentModel.updateMany({
                comment_productId: productId,
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            // update many comments_left
            await CommentModel.updateMany({
                comment_productId: productId,
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        }
        else {

            const maxRightValue = await CommentModel.findOne({
                comment_productId: productId
            }, 'commnet_right', { sort: { commnet_right: -1 } })

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            }
            else rightValue = 1
        }

        //insert to comment 
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentByParentId({ productId, parentCommentId, limit, offset }: IGetComment) {


        if (parentCommentId) {
            const parent = await CommentModel.findById(parentCommentId)
            if (!parent) throw new NotFoundError('not found comment for product')

            return comments({
                comment_productId: productId,
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            })
        }

        return comments({
            comment_productId: productId,
            comment_parentId: parentCommentId
        })
    }
}

async function comments(query: {}) {
    const comments = await CommentModel.find(query)
        .select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1,
        })
        .sort({
            comment_left: 1
        })
    return comments
}