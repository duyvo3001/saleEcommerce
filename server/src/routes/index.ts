import express, { Router ,Request , Response ,NextFunction } from 'express';
import routerShop from './access';

const router : Router = express.Router();

router.use('/v1/api', routerShop)  

// router.get('/', (req: Request, res: Response, next: NextFunction) => {
//     return res.status(200).json({
//         message: "hello diiii"
//     })
// })

export default router