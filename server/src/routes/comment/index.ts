import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { commentControler } from '../../controllers/commnet.Controller';
import { authentication } from '../../auth/authUtils';

export const routerComment = express.Router();

routerComment.use(authentication)

routerComment
    .post('', asyncHandler(commentControler.createComment))
    .get('', asyncHandler(commentControler.getComment))
    .delete('', asyncHandler(commentControler.deleteComment))
