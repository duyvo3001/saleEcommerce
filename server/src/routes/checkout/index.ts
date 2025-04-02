import express from 'express';
import { checkoutController } from '../../controllers/order/checkout.controller';
import { asyncHandler } from '../../helpers/asyncHandler';

export const routerCheckout = express.Router();

routerCheckout
    .post('/review', asyncHandler(checkoutController.CheckOutReview))
    .post('/order', asyncHandler(checkoutController.OrderByUser))
    .get('/getOrder', asyncHandler(checkoutController.GetOrderByUser))
    .get('/getOneOrder', asyncHandler(checkoutController.GetOneOrderByUser))
    .get('/CancelOrder', asyncHandler(checkoutController.CancelOrder))
    .get('/UpdateOrder', asyncHandler(checkoutController.UpdateOrder))


