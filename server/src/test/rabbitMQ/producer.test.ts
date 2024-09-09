// import * as amqplib from 'amqplib';
// interface RabbitMQConnection {
//     channel: amqplib.Channel;
//     connection: amqplib.Connection;
// }
// export const runProducer = async (): Promise<RabbitMQConnection | void> => {
//     try {
//         const connection = await amqplib.connect('amqp://guest:12345@localhost')
//         const channel = await connection.createChannel()

//         const queueName = 'test-topic'
//         await channel.assertQueue(queueName, {
//             durable: true
//         })

//         await channel.consume(queueName, (MESSAGES) => {
//             console.log(`Received ${MESSAGES?.content.toString()}`)
//         }, {
//             noAck: false
//         })
        
//     } catch (error) {
//         console.error("error ::: " + error)
//     }
// }

// runProducer().catch(console.error)

