import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { ProductController } from '../../controllers/product.controller';
const routerProduct = express.Router();


// authentication //
routerProduct
    .get('/search/all/:KeySearch', ProductController.getListSearchProduct)

routerProduct.use(authentication)
    .post('', asyncHandler(ProductController.createProduct))
    .put('/Publish/:id', asyncHandler(ProductController.PublishProductByShop))
    .put('/UnPublish/:id', asyncHandler(ProductController.UnPublishProductByShop))

    //QUERY 
    .get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
    .get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

export default routerProduct