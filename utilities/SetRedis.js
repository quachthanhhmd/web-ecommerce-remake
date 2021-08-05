const RedisClient = require("../config/redis");

const REDIS_TTL = process.env.REDIS_TTL;

const setResource = (resource, brands) => {

    const key = "ResourcesAndBrands"
    RedisClient.setex(
        key,
        REDIS_TTL,
        JSON.stringify({
            resource,
            brands
        })
    );
}

module.exports = {
    setResource
}