import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectMongodb from "./dbs/init.mongodb"
import { checkOverload } from "./helpers/check.connect";
import router from "./routes";

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
// module.exports = app
export default app