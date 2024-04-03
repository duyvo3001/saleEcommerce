import express, { Express} from "express";
import morgan from "morgan";
export const app : Express = express();

//init middleware
app.use(morgan("dev"))
//init db 

//handle errors

//init route 
app.get('/', (req, res , next) => {
    console.log(req)
    return res.status(200).json({
        message : "hello"
    })
})
// module.exports = app