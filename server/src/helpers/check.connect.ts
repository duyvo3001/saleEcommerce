import mongoose from "mongoose";
import os from "os";
import process from "process";
const _SECONDS = 10000
// check number connections in db
export const conuntConnect = () => {
    const numConnections = mongoose.connections.length
    console.log("number of connection ", numConnections)
    return numConnections
}

export const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        const maxConnections = numCores * 5

        // console.log("Active connections: ", numConnections)
        // console.log("Memory usage: ", memoryUsage/1024/1024 , " : MB")

        if(numConnections > maxConnections){
            console.log("max connections overload")
            // send mail ... function
        }
    }, _SECONDS)
}
