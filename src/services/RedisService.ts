import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: '127.0.0.1', // Replace with your Redis server IP or hostname
    port: 6379,        // Default Redis port
  },
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

export const redis = redisClient;
