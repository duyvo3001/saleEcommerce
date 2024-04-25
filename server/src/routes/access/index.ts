import express from 'express';
import accessController from '../../controllers/access.Controller';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
const routerShop = express.Router();


routerShop.post('/shop/signup', asyncHandler(accessController.signUp))
routerShop.post('/shop/login', asyncHandler(accessController.login))

// authentication //
routerShop.use(authentication)
routerShop.post('/shop/logout', asyncHandler(accessController.logout))
routerShop.post('/shop/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

export default routerShop