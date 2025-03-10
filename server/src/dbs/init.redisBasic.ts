import { createClient } from "redis";

// Create a client and connect to Redis
export const client = createClient({
  password: 'jxtjCy10Ili0AmluN5P1xVF80Y9wDdmM',
  socket: {
      host: 'redis-18649.c13.us-east-1-3.ec2.redns.redis-cloud.com',
      port: 18649
  }
});
client.on('connect', () => console.log('Redis Client Connected'));
client.on("error", (err) => console.log("Redis Client Error:", err));
client.connect();


