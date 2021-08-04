const redis = require("redis");

const REDIS_PORT_SSL = process.env.REDIS_PORT_SSL;


const client = redis.createClient(REDIS_PORT_SSL)// Ready action


client.on('ready', () => {
    console.log('Redis already!');
});

// Conect error action
client.on('error', (error) => {
    console.log("Error " + error)
});

module.exports = client;