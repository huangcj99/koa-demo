/**
 * Created by gunjoe on 2017/2/28.
 */
let router = require('koa-router')();
let co = require('co');

let States = require('../controller/states');

router.get('/',function *() {
    console.log("进入主页");
    yield co(States.rtnFile(this));
});

router.get(/^\/states\/(.*)/,function *() {
    console.log("获取states");
    yield co(States.rtnFile(this));
});

module.exports = router;