import express from 'express';
import accessController from '../../controllers/access.Controller';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
const routerShop = express.Router();

// authentication //

routerShop.post('/shop/signup', asyncHandler(accessController.signUp))
routerShop.post('/shop/login', asyncHandler(accessController.login))

routerShop.use(authentication)
routerShop.post('/shop/logout', asyncHandler(accessController.logout))

export default routerShop