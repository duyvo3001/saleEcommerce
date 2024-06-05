import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { cartController } from '../../controllers/cart.Controller';

export const routerCart = express.Router();

routerCart
.post('/',asyncHandler(cartController.addToCart))
.post('/update',asyncHandler(cartController.updateToCart))
.delete('/',asyncHandler(cartController.deleteToCart))
.get('/:id',asyncHandler(cartController.listToCart))

