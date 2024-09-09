import * as amqplib from 'amqplib';

interface RabbitMQConnection {
    channel: amqplib.Channel;
    connection: amqplib.Connection;
}

export const setupRabbitMQ = async (): Promise<RabbitMQConnection> => {
    const connection = await amqplib.connect('amqp://guest:12345@localhost');
    const channel = await connection.createChannel();
    
    const queueName = 'test-topic';
    await channel.assertQueue(queueName, { durable: true });
    
    return { channel, connection };
}

export const startConsumer = async (connection: RabbitMQConnection): Promise<void> => {
    const { channel } = connection;
    const queueName = 'test-topic';

    await channel.consume(queueName, (message) => {
        if (message) {
            console.log(`Received: ${message.content.toString()}`);
            channel.ack(message);
        }
    });
}

export const publishMessage = async (connection: RabbitMQConnection, message: string): Promise<void> => {
    const { channel } = connection;
    const queueName = 'test-topic';

    await channel.sendToQueue(queueName, Buffer.from(message));
}

export const closeConnection = async (connection: RabbitMQConnection): Promise<void> => {
    await connection.channel.close();
    await connection.connection.close();
}

if (require.main === module) {
    (async () => {
        try {
            const connection = await setupRabbitMQ();
            await startConsumer(connection);
            await publishMessage(connection, "Test message");
            
            // Keep the connection open for a while to allow messages to be processed
            setTimeout(async () => {
                await closeConnection(connection);
                process.exit(0);
            }, 5000);
        } catch (error) {
            console.error("Error:", error);
            process.exit(1);
        }
    })();
}