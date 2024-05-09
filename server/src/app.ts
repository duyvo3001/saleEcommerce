import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectMongodb from "./dbs/init.mongodb"
import { checkOverload } from "./helpers/check.connect";
import router from "./routes";
import { HttpError } from "./utils/errorhandling";
export const app: Express = express();

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db .
try {
    connectMongodb
} catch (error) {
    (error: Error) => {
        console.error(error);
        process.exit(1);
    }
}
checkOverload()
//init middleware

//init routes

app.use('/', router)

//handle errors

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new HttpError('Not Found', 404)
    console.log(error);
    
    next(error)
})

app.use((error : Error , req : Request, res : Response, next : NextFunction)=>{
    const statusCode = 500

    return res.status(statusCode).json({
        status : 'error',
        code: statusCode,
        stack: error.stack ,
        message :error.message || 'Internal Server Error'
    })
})
// module.exports = app
export default app