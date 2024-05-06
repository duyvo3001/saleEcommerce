import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { ProductController } from '../../controllers/product.controller';
const routerProduct = express.Router();


// authentication //
routerProduct
    .use(authentication)
    .post('', asyncHandler(ProductController.createProduct))
    .post('/publish/:id', asyncHandler(ProductController.PublishProductByShop))
    
    //QUERY 
    .get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
    .get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

export default routerProduct