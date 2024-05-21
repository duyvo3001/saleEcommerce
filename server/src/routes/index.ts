import express, { Router, Request, Response, NextFunction } from 'express';
import routerShop from './access';
import routerProduct from './product';
import { apiKey, permissions } from '../auth/checkAuth';
import { routerDiscount } from './discount';

const router: Router = express.Router();

//check apiKey
router.use(apiKey)
//check permissions
router.use(permissions('0000'))

router.use('/v1/api/product', routerProduct)
router.use('/v1/api/discount', routerDiscount)
router.use('/v1/api', routerShop)


export default router