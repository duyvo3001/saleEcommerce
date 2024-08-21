import { NextFunction, Request, Response } from "express"

import { SuccessResponse } from "../core/success.response"
import { InventoryService } from "../services/inventory.services"

export class inventoryController {

    /*
        * @desc add to cart user
        * @param {int} userId 
        * @param {*} res
        * @param {*} next
        * @method POST
        * @url /v1/api/cart/user
    */
    static addStockToInventory = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "add Success",
            metadata: await InventoryService.addStocktoInventory(req.body)
        }).send(res)
    }
}