import express from 'express';
import { AccessController } from '../../controllers/auth/access.controller';
import { asyncHandler } from '../../helpers/asyncHandler';
import { authentication } from '../../auth/authUtils';
const routerShop = express.Router();


routerShop.post('/shop/signup', asyncHandler(AccessController.signUp))
routerShop.post('/shop/login', asyncHandler(AccessController.login))
routerShop.post('/shop/login/google', asyncHandler(AccessController.loginGoogle))
routerShop.post('/shop/signup/third-party', asyncHandler(AccessController.signUpThirdParty)); // New route for third-party sign-up
routerShop.post('/shop/unlock-account', asyncHandler(AccessController.unlockAccount))
routerShop.post('/shop/forgot-password', asyncHandler(AccessController.forgotPassword))
routerShop.post('/shop/verify-reset-code', asyncHandler(AccessController.verifyResetCode))
routerShop.post('/shop/reset-password', asyncHandler(AccessController.resetPassword))

// authentication //
routerShop.use(authentication)
routerShop.post('/shop/logout', asyncHandler(AccessController.logout))
routerShop.post('/shop/handlerRefreshToken', asyncHandler(AccessController.handlerRefreshToken))

export default routerShop