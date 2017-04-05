/**
 * Created by gunjoe on 2017/2/24.
 */
let path = require('path');
let fs = require('fs');

exports.rtnFile = function (ctx) {
    let _ctx = ctx;
    return function *() {
        let url = RegExp.$1;

        if (_ctx.url === "/") {
            url = "/charmingHui/src/index.html";
        }

        let filePath = path.join(process.cwd(),url);
        // console.log(filePath);
        let stateType = {
            html:'text/html',
            css:'text/css',
            js:'application/x-javascript',
            jpg:'image/jpeg',
            png:'image/png',
            gif:'image/gif',
            ico:'image/x-icon'
        };

        let ext = path.extname(url),
            type = ext.slice(1);

        let existsFile = function () {
            return new Promise((resolve,reject) => {
                fs.exists(filePath,(exists) => {
                    if (!exists) {
                        reject(new Error("don't has file"));
                    }
                    else {
                        resolve();
                    }
                });
            })
        };

        let rtnFile = function () {
            return new Promise((resolve,reject) => {
                //创建流返回相应文件到浏览器
                let chunks = [];
                let size = 0;
                let rs = fs.createReadStream(filePath);
                rs.on('data',(chunk) => {
                    chunks.push(chunk);
                    size += chunk.length;
                });
                rs.on('end',() => {
                    let buf = Buffer.concat(chunks,size);
                    _ctx.response.set("Access-Control-Allow-Origin","*");
                    _ctx.response.set("Content-Length",size);
                    _ctx.response.type = stateType[type];
                    _ctx.response.body = buf;
                    resolve();
                });
                rs.on('error',(err) => {
                    reject(err);
                });
            });
        };

        let exists = yield existsFile();
        let file = yield rtnFile();
    }
};









