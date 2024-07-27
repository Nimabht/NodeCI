const redis = require("redis");
const { promisify } = require("util");
const config = require("../config/keys");
const keys = require("../config/keys");

const client = redis.createClient(keys.redisUrl);

// Promisify the necessary Redis client methods
client.get = promisify(client.get).bind(client);
client.setex = promisify(client.setex).bind(client);
client.hset = promisify(client.hset).bind(client);
client.hget = promisify(client.hget).bind(client);

module.exports = client;
