import { Schema, model, Types } from "mongoose";
import { clothesModels, electronicModels, ProductModels } from "../models/product.model";
import { BadRequestError } from "../core/error.response";

interface IProduct {
    product_name: String,
    product_thump: String,
    product_description: String,
    product_Price: Number,
    product_quantity: Number,
    product_type: [String],
    product_shop: String,
    product_attributes: Schema.Types.Mixed,
}

class ProductFactory {

    /*
        * type :"clothing",
        * payload 
    */
    async createProduct(type: string, payload: IProduct) {

        switch (type) {
            case 'Electronics':
                return new Electronics(payload)
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError("Invalid type");

                break;
        }
    }
}

/*
    *define base prouct class
*/
class Product {
    product_name: String;
    product_thump: String;
    product_description: String;
    product_Price: Number;
    product_quantity: Number;
    product_type: [String];
    product_shop: String;
    product_attributes: Schema.Types.Mixed;
    constructor({
        product_name, product_thump, product_description, product_Price,
        product_quantity, product_type, product_shop, product_attributes
    }: IProduct
    ) {
        this.product_name = product_name
        this.product_thump = product_thump
        this.product_description = product_description
        this.product_Price = product_Price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }
    async createProduct() {
        return await ProductModels.create(this)
    }
}

/*
    * define sub-class for different product types clothing
*/
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothesModels.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError("create new Clothing error");
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError("create new Product error");

        return newProduct
    }
}

class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronicModels.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError("create new Clothing error");
        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError("create new Product error");

        return newProduct
    }

}

export default new ProductFactory()