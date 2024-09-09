// import * as amqplib from 'amqplib';

// interface RabbitMQConnection {
//     channel: amqplib.Channel;
//     connection: amqplib.Connection;
// }

// const MESSAGES = 'Duy vo ~'
// export const runConsumer = async (): Promise<RabbitMQConnection | void> => {
//     try {
//         const connection = await amqplib.connect('amqp://guest:12345@localhost')
//         const channel = await connection.createChannel()

//         const queueName = 'test-topic'
//         await channel.assertQueue(queueName, {
//             durable: true
//         })

//         await channel.sendToQueue(queueName, Buffer.from(MESSAGES))
//         console.log(`Message sent : `, MESSAGES)
//     } catch (error) {
//         console.error(`error::::::: ${error}`)
//     }
// }

// runConsumer().catch(console.error)

