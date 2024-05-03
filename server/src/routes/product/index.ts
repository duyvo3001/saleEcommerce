import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import ProductController from '../../controllers/product.controller';
const routerProduct = express.Router();


// authentication //
routerProduct
    .use(authentication)
    .post('', asyncHandler(ProductController.createProduct))

export default routerProduct