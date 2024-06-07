import express from 'express';
import { checkoutController } from '../../controllers/checkout.Controller';
import { asyncHandler } from '../../helpers/asyncHandler';

export const routerCheckout = express.Router();

routerCheckout
    .post('/review', asyncHandler(checkoutController.CheckOutReview))


