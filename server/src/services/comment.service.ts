import { CommentModel } from './../models/comment.model';
import { findProductRepo } from './../models/repositories/product.repo';
import { query } from 'express';
import { Types } from "mongoose";
import { NotFoundError } from "../core/error.response";
import { Icomment, IDeleteComment, IGetComment } from "./interface/Icomment";


/*
    key features: Comment service
    + add comment [user,shop]
    + get a list of comments [user,shop]
    + delete a comment [user,shop,admin]
*/
export class CommentService {

    static async createComment({ productId, userId, content, parentCommentId }: Icomment) {

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

            console.log("maxRightValue:::::", maxRightValue)

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            }
            else rightValue = 1

            console.log("rightvalue:::::::", rightValue)
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

            return queryComments({
                comment_productId: productId,
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            })
        }

        return queryComments({
            comment_productId: productId,
            comment_parentId: parentCommentId
        })
    }

    static async deleteComment({ commentId, productId }: IDeleteComment) {
        // console.log(commentId, productId)
        const foundProduct = await findProductRepo({
            product_id: productId,
            unSelect: []
        })

        if (!foundProduct) throw new NotFoundError(`Could not find product`)

        //1. determine value left and right values
        const comment = await CommentModel.findById(commentId)

        if (!comment) throw new NotFoundError(`Could not find comment`)

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        //2. count width
        const width = rightValue - leftValue + 1

        //3. delete all comment children
        await CommentModel.deleteMany({
            comment_productId: new Types.ObjectId(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })
        //4. update remaining comment

        await CommentModel.updateMany({ // check right value
            comment_productId: productId,
            comment_right: { $gt: rightValue } 
        }, {
            $inc: { comment_right: -width }
        })

        await CommentModel.updateMany({// check left value
            comment_productId: productId,
            comment_left: { $gt: rightValue } 
        }, {
            $inc: { comment_left: -width }
        })

    }

}


async function queryComments(query: {}) {
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