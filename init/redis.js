/**
 * Created by gunjoe on 2017/2/28.
 */
let redisDb = (function () {
    let redis = require('redis');
    let bluebird = require('bluebird');

    bluebird.promisifyAll(redis.RedisClient.prototype);
    bluebird.promisifyAll(redis.Multi.prototype);

    let client = redis.createClient({
        host:'127.0.0.1',
        port:6379
    });

    return client;
})();

module.exports = redisDb;