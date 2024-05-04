import { Schema, model, Types } from "mongoose";
import { clothesModels, electronicModels, ProductModels, furnitureModels } from "../models/product.model";
import { BadRequestError } from "../core/error.response";

interface IProduct {
    product_name: String,
    product_thump: String,
    product_description: String,
    product_Price: Number,
    product_quantity: Number,
    product_type: [String],
    product_shop: Types.ObjectId,
    product_attributes: Schema.Types.Mixed,
}
interface ProductClass {
    createProduct: () => any; 
}
class ProductFactory {

    /*
        * type :"clothing",
        * payload 
    */
    static productRegistry: { [type: string]: any } = {};

    static registerProductType(type: string, classRef : any) {
        ProductFactory.productRegistry[type] = classRef
    }
    async createProduct(type: string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError("Invalid type");
        return new productClass(payload).createProduct()
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
    product_shop: Types.ObjectId;
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
    async createProduct(product_id: any) {
        return await ProductModels.create({ ...this, _id: product_id })
    }
}

/*
    * define sub-class for different product types clothing
*/
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothesModels.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError("create new Clothing error");
        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError("create new Product error");

        return newProduct
    }
}

class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronicModels.create({
            ...this.product_attributes,
            product_shop: new Types.ObjectId(this.product_shop)
        })
        if (!newElectronic) throw new BadRequestError("create new Electronic error");
        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError("create new Product error");

        return newProduct
    }

}
class Furniture extends Product {

    async createProduct() {
        const newfurniture = await furnitureModels.create({
            ...this.product_attributes,
            product_shop: new Types.ObjectId(this.product_shop)
        })
        if (!newfurniture) throw new BadRequestError("create new furniture error");
        const newProduct = await super.createProduct(newfurniture._id)
        if (!newProduct) throw new BadRequestError("create new Product error");

        return newProduct
    }

}
//register product type 
ProductFactory.registerProductType("Electronics", Electronics)
ProductFactory.registerProductType("Furniture", Furniture)
ProductFactory.registerProductType("Clothing", Clothing)

export default new ProductFactory()