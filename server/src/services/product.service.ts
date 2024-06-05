import { removeUndefindObject, updateNestedObject } from './../utils/productUtils/productRepo.utils';
import { Schema, Types } from "mongoose";
import { clothesModels, electronicModels, ProductModels, furnitureModels } from "../models/product.model";
import { BadRequestError } from "../core/error.response";
import { findAllDraftsForShopRepo, findAllProductRepo, findAllPublishForShopRepo, findProductRepo, publishProductByShopRepo, searchProductByUserRepo, updateProductById } from "../models/repositories/product.repo";
import { insertInventory } from '../models/repositories/inventory.repo';

interface IProduct {
    product_name: String,
    product_thump: String,
    product_description: String,
    product_Price: number,
    product_quantity: number,
    product_type: [String],
    product_shop: Types.ObjectId,
    product_attributes: Schema.Types.Mixed,
}
interface InterfaceFindProduct {
    product_shop: Types.ObjectId,
    limit: number,
    skip: number
}

export class ProductFactory {

    /*
        * type :"clothing",
        * payload 
    */
    static productRegistry: { [type: string]: any } = {};

    static registerProductType(type: string, classRef: any) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type: string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass)
            throw new BadRequestError("Invalid type");
        return new productClass(payload).createProduct()
    }

    static async updateProduct(type: string, product_id: string, payload: IProduct) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError("Invalid type");
        return new productClass(payload).updateProduct(product_id)
    }

    /*
        * find draft product for shop
    */
    static async findAllDraftsForShop({ product_shop, limit, skip }: InterfaceFindProduct) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShopRepo({ query, limit, skip })
    }
    static async findAllPublishForShop({ product_shop, limit, skip }: InterfaceFindProduct) {
        const query = { product_shop, isPublish: true }
        return await findAllPublishForShopRepo({ query, limit, skip })
    }

    /* 
        *  PUT publish Product 
    */
    static async publishProductByShop({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: Types.ObjectId }) {
        return await publishProductByShopRepo({ product_shop, product_id })
    }
    /* 
       *  PUT UnPublish Product 
   */
    static async UnPublishProductByShop({ product_shop, product_id }: { product_shop: Types.ObjectId, product_id: Types.ObjectId }) {
        return await publishProductByShopRepo({ product_shop, product_id })
    }
    /* 
        *  GET search Product
    */
    static async searchProduct(KeySearch: string) {
        return await searchProductByUserRepo(KeySearch)
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublish: true } }) {
        return await findAllProductRepo(
            {
                limit, sort, filter, page,
                select: ['product_name', 'product_Price', 'product_thump','product_shop']
            })
    }

    static async findProduct({ product_id, unSelect }: { product_id: string, unSelect: string[] }) {
        return await findProductRepo({ product_id, unSelect: unSelect })
    }


}

/*
    *define base prouct class
*/
class Product {
    product_name: String;
    product_thump: String;
    product_description: String;
    product_Price: number;
    product_quantity: number;
    product_type: [String];
    product_shop: Types.ObjectId;
    product_attributes: Schema.Types.Mixed;
    constructor({
        product_name, product_thump, product_description, product_Price,
        product_quantity, product_type, product_shop, product_attributes,
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
    /*
        * create product 
    */
    async createProduct(product_id: any) {
        const newProduct = await ProductModels.create({ ...this, _id: product_id })
        const productid = await newProduct._id
        if (newProduct) {
            await insertInventory({
                product_id: productid,
                shop_id: this.product_shop,
                stock: this.product_quantity,
                location: 'unKnown'
            })
        }
        return newProduct

    }


    /*
        * update product 
    */
    async updateProduct(product_id: string, bodyUpdate: {}) {
        return await updateProductById({ product_id: product_id, bodyUpdate: bodyUpdate, model: ProductModels, isNew: true })
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

    async updateProduct(product_id: string) {

        const objectParams = removeUndefindObject(this)

        /*
            * remove obj a{ a : 2 } but don't remove obj a{ b : 1} in obj  a{ a : 2 , b : 1 }
        */
        const updateNestedObj_attributes = updateNestedObject(objectParams.product_attributes)
        const updateNestedObj_params = updateNestedObject(objectParams)

        if (objectParams.product_attributes) {
            await updateProductById(
                {
                    product_id: product_id,
                    bodyUpdate: updateNestedObj_attributes,
                    model: clothesModels,
                    isNew: true
                })
        }
        const updateProduct = await super.updateProduct(product_id, updateNestedObj_params);
        return updateProduct
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

// export default new ProductFactory()