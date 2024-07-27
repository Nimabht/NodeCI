const mongoose = require("mongoose");
const redisClient = require("./redisClient");
const mongooseExecFunction = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");

  return this;
};

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return mongooseExecFunction.apply(this, arguments);
  }

  const collection = this.mongooseCollection.name;
  const query = this.getQuery();

  const redisKey = JSON.stringify({ ...query, collection });

  const cached = await redisClient.hget(this.hashKey, redisKey);

  if (cached) {
    console.log("CACHED");
    return JSON.parse(cached);
  }

  console.log("IM ABOUT TO RUN A QUERY");

  const result = await mongooseExecFunction.apply(this, arguments);

  await redisClient.hset(
    this.hashKey,
    redisKey,
    JSON.stringify(result),
    "EX",
    5,
  );

  return result;
};

module.exports = {
  clearHash(hashKey) {
    redisClient.del(JSON.stringify(hashKey));
  },
};
