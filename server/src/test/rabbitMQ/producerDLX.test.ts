import * as amqplib from 'amqplib';

interface RabbitMQConnection {
    channel: amqplib.Channel;
    connection: amqplib.Connection;
}

const log: typeof console.log = console.log;

// Override console.log with a new implementation
console.log = function(...args: any[]): void {
    // Create a new Date object for the current timestamp
    const timestamp = new Date();
    
    // Call the original log function with the timestamp prepended to the arguments
    log.apply(console, [timestamp, ...args]);
};

const messages = 'new a product: Title abcassd';

const runProducer = async () => {
    try {
        const connection = await amqplib.connect('amqp://guest:12345@localhost')
        const channel = await connection.createChannel()
        const notificationExchange = 'notificationEx' // notificationEx direct
        const notiQueue = 'notificationQueueProcess' // notificationQueue direct
        const notificationExchangeDLX = 'notificationExDLX' // notificationEx DLX direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert

        //1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        //2.create queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // allow connetions access same time in queue
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        //3.bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange,"")

        //4.send message
        const msg = 'a new product create'
        console.log(`product msg::`, msg)
        
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })


        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500)
    } catch (error) {
        console.error(`erro:: `, error)
    }
}
runProducer()