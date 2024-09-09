import { setupRabbitMQ, startConsumer, publishMessage, closeConnection } from './proAndCon.test';

describe('RabbitMQ Tests', () => {
    let connection: any;

    beforeAll(async () => {
        connection = await setupRabbitMQ();
    });

    afterAll(async () => {
        await closeConnection(connection);
    });

    test('should send and receive a message', async () => {
        const testMessage = 'Test message';

        // Start consumer
        await startConsumer(connection);

        // Publish message
        await publishMessage(connection, testMessage);

        // You might need to implement a way to wait for and capture the received message
        // This could involve modifying the consumer to use a callback or return a Promise

        // Assert that the message was received correctly
        // expect(receivedMessage).toBe(testMessage);
    });
});