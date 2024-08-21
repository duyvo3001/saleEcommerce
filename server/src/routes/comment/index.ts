import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { commentControler } from '../../controllers/commnet.Controller';

export const routerComment = express.Router();

routerComment
    .post('/', commentControler.createComment)
    .get('/', commentControler.getComment)
