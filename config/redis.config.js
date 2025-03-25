const Redis = require('ioredis');

const redis = new Redis({
    host: '127.0.0.1', // Redis server IP
    port: 6379,        // Redis default port
});

redis.on('connect', () => {
    console.log('Connected to Redis successfully!');
});

redis.on('error', (err) => {
    console.log('Redis connection error:', err);
});

module.exports = redis;
