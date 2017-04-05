/**
 * Created by gunjoe on 2017/2/28.
 */
let router = require('koa-router')();

let Account = require('../controller/account');

router.post('/register/:username',Account.register);
router.post('/login/:username',Account.login);
router.post('/sessionLogin',Account.sessionLogin);
router.get('/sessionDel',Account.sessionDel);

module.exports = router;