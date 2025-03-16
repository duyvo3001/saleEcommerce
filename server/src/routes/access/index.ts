import express from 'express';
import { AccessController } from '../../controllers/access.Controller';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
const routerShop = express.Router();


routerShop.post('/shop/signup', asyncHandler(AccessController.signUp))
routerShop.post('/shop/login', asyncHandler(AccessController.login))
routerShop.post('/shop/signup/third-party', asyncHandler(AccessController.signUpThirdParty)); // New route for third-party sign-up

// authentication //
// routerShop.use(authentication)
routerShop.post('/shop/logout', asyncHandler(AccessController.logout))
routerShop.post('/shop/handlerRefreshToken', asyncHandler(AccessController.handlerRefreshToken))

export default routerShop