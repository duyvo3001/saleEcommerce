import { NextFunction, Request, Response } from "express"
import { SuccessResponse } from "../core/success.response";
import productService from "../services/product.service";
import { Types } from "mongoose";

class ProductController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "Product created",
            metadata: await productService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.headers['x-client-id']
            })
        }).send(res);
    }

    /*
        * Query
    */
   /**
    * @desc Get all Drafts for shop
    * @param {Number} limit
    * @param {Number} Skip
    * @return {Json} 
    */
    getAllDraftsForShop = async (req: Request, res: Response, next: NextFunction) => {
        const limit = 50, skip = 0

        new SuccessResponse({
            message: "Product created",
            metadata: await productService.findAllDraftsForShop({
                product_shop: new Types.ObjectId(req.headers['x-client-id']?.toString()),
                limit,
                skip
            })
        }).send(res);
    }
    /*
        * End Query
    */

}

export default new ProductController()