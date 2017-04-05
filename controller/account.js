/**
 * Created by gunjoe on 2017/2/28.
 */
let crypto = require('crypto');
let co = require('co');

let User = require('../model').User;
let redisDb = require('../init/redis');

exports.register = function *() {
    let ctx = this;
    yield co(function *() {
        let usr = ctx.query.usr,
            pwd = ctx.query.pwd;

        let findUser = () => {
            return new Promise((resolve,reject) => {
                    User.findOne({username:usr},(err,doc) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            if (!doc) {
                                resolve();
                            }
                            else {
                                ctx.response.body = JSON.stringify({
                                    "status":false,
                                    "info":"该账户已存在"
                                });
                                reject();
                            }
                        }
                    })
                }
            );
        };

        let insertUser = () => {
            return new Promise((resolve,reject) => {
                let hash = crypto.createHash("md5");
                hash.update(pwd);
                pwd = hash.digest('hex');

                let user = new User({
                    username:usr,
                    password:pwd
                });

                user.save((err) => {
                    if (err) {
                        reject(err);
                    }
                    ctx.response.body = JSON.stringify({
                        "status":true,
                        "info":"注册成功"
                    });
                    resolve();
                })
            });
        };

        yield findUser();
        yield insertUser();
    })
        .catch((err) => {
            console.log(err);
        });

};

exports.login = function *() {
    let ctx = this;
    yield co(function *() {
        let usr = ctx.params.username,
            pwd = ctx.query.pwd;

        let hash = crypto.createHash('md5');
        hash.update(pwd);
        pwd = hash.digest('hex');

        let findUser = () => {
            return new Promise((resolve,reject) => {
                    User.findOne({username:usr},(err,doc) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            if (!doc) {
                                ctx.response.body = JSON.stringify({
                                    "status":false,
                                    "info":"用户不存在，请注册"
                                });
                                reject("用户不存在");
                            }
                            else {
                                if (doc.password !== pwd) {
                                    ctx.response.body = JSON.stringify({
                                        "status":false,
                                        "info":"密码不正确"
                                    });
                                    reject("密码错误");
                                }
                                else {
                                    ctx.response.body = JSON.stringify({
                                        "status":true,
                                        "info":"登录成功"
                                    });
                                    resolve();
                                }
                            }
                        }
                    })
                }
            );
        };

        yield findUser();

        ctx.session[usr] = {
            pwd:pwd
        };

    })
        .catch((err) => {
            console.log(err);
        });
};

exports.sessionLogin = function *() {
    let hasSession = this.cookies.get('koa.sid');
    if (! hasSession) {
        this.response.body = JSON.stringify({
            "status":false,
            "info":"请重新登陆"
        });
    }
    else {
        this.response.body = JSON.stringify({
            "status":true,
            "info":"保持登录状态"
        })
    }
};

exports.sessionDel = function *() {
    this.session = null;
    this.response.body = JSON.stringify({
        "status":true,
        "info":"删除成功"
    });
};