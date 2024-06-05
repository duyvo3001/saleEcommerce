import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
import { cartController } from '../../controllers/cart.Controller';

export const routerCart = express.Router();

routerCart
.post('/',cartController.addToCart)
.post('/update',cartController.updateToCart)
.delete('/',cartController.deleteToCart)
// .get('/',cartController.addToCart)

