import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { ProductController } from '../../controllers/product.controller';
const routerProduct = express.Router();


// authentication //
routerProduct
    .use(authentication)
    .post('', asyncHandler(ProductController.createProduct))
    
    //QUERY 
    .get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))

export default routerProduct