import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { ProductController } from '../../controllers/product/product.controller';
const routerProduct = express.Router();


// authentication //
routerProduct
    .get('/search/all/:KeySearch', ProductController.getListSearchProduct)
    .get('', ProductController.findAllProduct)
    .get('/:product_id', ProductController.findProduct)

routerProduct.use(authentication)
    .post('', asyncHandler(ProductController.createProduct))
    .patch('/:product_id', asyncHandler(ProductController.updateProduct))
    .put('/Publish/:id', asyncHandler(ProductController.PublishProductByShop))
    .put('/UnPublish/:id', asyncHandler(ProductController.UnPublishProductByShop))

    //QUERY 
    .get('/drafts/all', asyncHandler(ProductController.getAllDraftsForShop))
    .get('/publish/all', asyncHandler(ProductController.getAllPublishForShop))

export default routerProduct