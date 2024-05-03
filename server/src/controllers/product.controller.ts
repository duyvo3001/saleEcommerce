import { NextFunction, Request, Response } from "express"
import { SuccessResponse } from "../core/success.response";
import productService from "../services/product.service";

class ProductController {
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.body.product_type, req.body)
        new SuccessResponse({
            message: "Product created",
            metadata: await productService.createProduct(req.body.product_type, req.body)
        }).send(res);
    }
}

export default new ProductController()