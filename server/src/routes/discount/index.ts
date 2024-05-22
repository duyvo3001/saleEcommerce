import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { DiscountController } from '../../controllers/dicount.Controller';
export const routerDiscount = express.Router();

routerDiscount.use(authentication)

routerDiscount.post('/discountCode',asyncHandler(DiscountController.createDiscountCode))
routerDiscount.get('/get-all-list-discount',asyncHandler(DiscountController.getAllDiscountCodes))
// routerDiscount.post('/discountCode',asyncHandler(DiscountController.createDiscountCode))