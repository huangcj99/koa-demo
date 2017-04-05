/**
 * Created by gunjoe on 2017/2/28.
 */
const redisStore = require('koa-redis');

exports.opt_redis = {
    store: redisStore({
        host: '127.0.0.1',
        port: 6379
    }),
    cookie:{
        path: '/',
        httpOnly: true,
        maxAge: 7 * 24 * 3600 * 1000,
        rewrite: true,
        signed: true
    }
};