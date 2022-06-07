const Redis = require('redis');

module.exports.getOrSetCache = (key, cb) => {
    const redisClient = Redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
    });

    return new Promise(async (resolve, reject) => {
        try {
            await redisClient.connect();
            const data = await redisClient.get(key);
            if (data != null) {
                await redisClient.disconnect();
                resolve(JSON.parse(data));
            } else {
                const freshData = await cb();
                await redisClient.setEx(key, 36000, JSON.stringify(freshData));
                await redisClient.disconnect();
                resolve(freshData);
            }
        } catch (err) {
            console.error(err);
            reject(err);
        }
    })
}