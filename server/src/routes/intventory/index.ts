import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { inventoryController } from '../../controllers/inventory.controller';

export const routerInventory = express.Router();

routerInventory.use(authentication)
routerInventory
    .post('/', asyncHandler(inventoryController.addStockToInventory))


