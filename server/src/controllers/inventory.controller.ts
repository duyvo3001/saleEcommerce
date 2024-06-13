import { NextFunction, Request, Response } from "express"

import { SuccessResponse } from "../core/success.response"
import { InventoryService } from "../services/inventory.services"

export class inventoryController {
    static addStockToInventory = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: "add Success",
            metadata: await InventoryService.addStocktoInventory(req.body)
        }).send(res)
    }
}