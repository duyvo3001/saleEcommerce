import { updateProductById } from '../../models/repositories/product.repo';
import { NextFunction, Request, Response } from "express"
import { SuccessResponse } from "../../core/success.response";
import { ProductFactory } from "../../services/product.service";
import { Types } from "mongoose";

export class ProductController {

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static createProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Product created",
            metadata: await ProductFactory.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.headers['x-client-id']
            })
        }).send(res);
    }

    /*
        * update product
    */
   /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Product updated",
            metadata: await ProductFactory.updateProduct(req.body.product_type, req.params.product_id, {
                ...req.body,
                product_shop: req.headers['x-client-id']
            })
        }).send(res);

    }

    /*
        * Query Drafts
    */
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} Skip
     * @return {Json} 
     */
    static getAllDraftsForShop = async (req: Request, res: Response, next: NextFunction) => {
        const limit = 50, skip = 0
        new SuccessResponse({
            message: "Draft of shop",
            metadata: await ProductFactory.findAllDraftsForShop({
                product_shop: new Types.ObjectId(req.headers['x-client-id']?.toString()),
                limit,
                skip
            })
        }).send(res);
    }
    /*
        * End Query
    */

    /*
        * Query Publish
    */
    /**
     * @desc Get all Drafts for shop
     * @param {Number} limit
     * @param {Number} Skip
     * @return {Json} 
     */
    static getAllPublishForShop = async (req: Request, res: Response, next: NextFunction) => {
        const limit = 50, skip = 0
        new SuccessResponse({
            message: "get publish for shop",
            metadata: await ProductFactory.findAllPublishForShop({
                product_shop: new Types.ObjectId(req.headers['x-client-id']?.toString()),
                limit,
                skip
            })
        }).send(res);
    }
    /*
        * End Query
    */

   /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static PublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "publish for shop success",
            metadata: await ProductFactory.publishProductByShop({
                product_id: new Types.ObjectId(req.params.id),
                product_shop: new Types.ObjectId(req.headers['x-client-id']?.toString())
            })
        }).send(res);
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static UnPublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Un Publish for shop success",
            metadata: await ProductFactory.UnPublishProductByShop({
                product_id: new Types.ObjectId(req.params.id),
                product_shop: new Types.ObjectId(req.headers['x-client-id']?.toString())
            })
        }).send(res);
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static getListSearchProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Get list search product success",
            metadata: await ProductFactory.searchProduct(req.params.KeySearch)
        }).send(res);
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static findAllProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Find all products success",
            metadata: await ProductFactory.findAllProducts(req.query)
        }).send(res);
    }

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static findProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Find all products success",
            metadata: await ProductFactory.findProduct({ product_id: req.params.product_id, unSelect: ['__v', 'product_Variation'] })
        }).send(res);
    }

}
