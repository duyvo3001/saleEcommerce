import app from "./src/app";

const PORT : Number = 8000 ; 

const server = app.listen(PORT,()=>{
    console.log('server listening on ',PORT)
})

process.on('SIGINT',()=>{
    server.close(()=> console.log('server closed'))
})
