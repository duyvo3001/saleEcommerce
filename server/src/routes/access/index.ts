import express from 'express';
import accessController from '../../controllers/access.Controller';
const routerShop = express.Router();

routerShop.post('/shop/signup',accessController.signUp)

export default routerShop