import express from 'express';
import accessController from '../../controllers/access.Controller';
import { asyncHandler } from '../../auth/checkAuth';
const routerShop = express.Router();

routerShop.post('/shop/signup',asyncHandler(accessController.signUp))
routerShop.post('/shop/login',asyncHandler(accessController.login))

// authentication //
routerShop.post('/shop/login',asyncHandler(accessController.login))

export default routerShop