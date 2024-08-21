import { Types } from "mongoose";

export interface Icomment {
    productId : Types.ObjectId, 
    userId : Number, 
    content : string, 
    parentCommentId : any
}

export interface IGetComment extends Pick<Icomment,'productId'|'parentCommentId'>{
    limit : Number ,
    offset : Number
}