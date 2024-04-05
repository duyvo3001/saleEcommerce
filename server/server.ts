import app from "./src/app";
import configMongodb from "./src/config/config.mongodb";


const PORT = configMongodb.app.port; 

const server = app.listen(PORT,()=>{
    console.log('server listening on ',PORT)
})

process.on('SIGINT',()=>{
    server.close(()=> console.log('server closed'))
})
