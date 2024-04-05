import express, { Express, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import connectMongodb from "./dbs/init.mongodb"
import { checkOverload } from "./helpers/check.connect";

export const app: Express = express();

//init middleware
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
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

app.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        message: "hello diiii"
    })
})

//handle errors
// module.exports = app
export default app