import express, { Router, Request, Response, NextFunction } from 'express';
import routerShop from './access';
import routerProduct from './product';
import { apiKey, permissions } from '../auth/checkAuth';

const router: Router = express.Router();

//check apiKey
router.use(apiKey)
//check permissions
router.use(permissions('0000'))

router.use('/v1/api', routerShop)
.use('/v1/api/product', routerProduct)


export default router