import { createClient } from "redis";

// Create a client and connect to Redis
export const client = createClient({
  password: 'gJL5Dz3hFJDCyaqBKMHcdI4HhiNUn19k',
  socket: {
      host: 'redis-17554.c275.us-east-1-4.ec2.redns.redis-cloud.com',
      port: 17554
  }
});
client.on('connect', () => console.log('Redis Client Connected'));
client.on("error", (err) => console.log("Redis Client Error:", err));
client.connect();


