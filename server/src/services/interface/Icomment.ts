import { Types } from "mongoose";

interface Icomment {
    productId: Types.ObjectId,
    userId: Number,
    content: string,
    parentCommentId: any
}
interface IGetComment extends Pick<Icomment, 'productId' | 'parentCommentId'> {
    limit: Number,
    offset: Number
}

interface IDeleteComment {
    commentId: Types.ObjectId,
    productId: string
}

export { IGetComment, Icomment, IDeleteComment }