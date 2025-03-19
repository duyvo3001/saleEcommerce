import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectMongodb from "./dbs/init.mongodb"
import router from "./routes";
import cors from "cors"; // Import the cors package
import { checkOverload } from "./helpers/check.connect";
import { HttpError } from "./utils/errorhandling";

// import { initRedis } from "./dbs/init.redis";
export const app: Express = express();

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));

//init db .
try {
    connectMongodb
} catch (error) {
    (error: Error) => {
        console.error(error);
        process.exit(1);
    }
}

//init redis


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

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = 500
    console.log(error.stack);
    console.log(error.message);
    
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack, // dung de bao loi tren ! khong duoc dung tren moi truong production
        message: error.message || 'Internal Server Error'
    })
})
// module.exports = app
export default app