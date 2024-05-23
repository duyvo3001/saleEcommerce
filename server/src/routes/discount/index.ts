import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { DiscountController } from '../../controllers/dicount.Controller';
export const routerDiscount = express.Router();
routerDiscount.post('/amount',asyncHandler(DiscountController.getDiscountAmount))

routerDiscount.use(authentication)

routerDiscount.post('/discountCode',asyncHandler(DiscountController.createDiscountCode))
routerDiscount.get('/all-list-discount-product',asyncHandler(DiscountController.getAllDiscountCodesWithProduct))
routerDiscount.get('/all-list-discount-shop',asyncHandler(DiscountController.getAllDiscountCodesWithShop))
routerDiscount.delete('',asyncHandler(DiscountController.DeleteDiscount))
routerDiscount.post('/cancel',asyncHandler(DiscountController.CancelDiscount))
// routerDiscount.post('/amount',asyncHandler(DiscountController.getDiscountAmount))