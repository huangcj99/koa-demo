/**
 * Created by gunjoe on 2017/2/23.
 */
const Koa = require('koa');
const session = require('koa-generic-session');
const Router = require('koa-router');

const app = Koa();
const router = new Router();

let mongoose = require('./init/mongoose');
let opt_redis = require('./init/session').opt_redis;
let states = require('./routes/states');
let account = require('./routes/account');

//cookies的签名密钥
app.keys = ['keys', 'keykeys'];

//挂载账户登录、注册、session模块路由
router.use("/account",session(opt_redis),account.routes());
//静态处理路由挂载到中间件上
app.use(states.routes());
//将路由模块加载到中间件
app.use(router.routes());

app.listen(8080,function () {
    console.log("开启8080");
});


