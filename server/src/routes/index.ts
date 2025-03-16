import express, { Router, Request, Response, NextFunction } from 'express';
import routerShop from './access';
import routerProduct from './product';
import { apiKey, permissions } from '../auth/checkAuth';
import { routerDiscount } from './discount';
import { routerCart } from './cart';
import { routerCheckout } from './checkout';
import { routerInventory } from './intventory';
import { routerComment } from './comment';
import { routerNotification } from './notification';

const router: Router = express.Router();

//check apiKey
router.use('/v1/api', routerShop)
router.use(apiKey)
//check permissions
router.use('/v1/api/cart', routerCart)
router.use(permissions('0000'))

router.use('/v1/api/product', routerProduct)
router.use('/v1/api/checkout', routerCheckout)
router.use('/v1/api/discount', routerDiscount)
router.use('/v1/api/inventory', routerInventory)
router.use('/v1/api/comment', routerComment )
router.use('/v1/api/notification', routerNotification )


export default router