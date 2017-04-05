/**
 * Created by gunjoe on 2017/2/6.
 */
const fs = require('fs');

const mongoose = require('mongoose');

//数据库连接并创建首页图片模型
mongoose.connect("mongodb://localhost:27017/charmingHui");
let list_img_schema = new mongoose.Schema({
    url:{type:String,require:true,unique:true},
    size:{type:String,require:true}
});
let vps_list = mongoose.model("vps_list",list_img_schema);

//主页图片url数据
let homepage = {
    dir_path:"D:nodeProject/myVps/charmingHui/src/img/commodity_list/pop_up1/list_img1",
    big:0,
    small:0,
    ext:".jpg",
    name_rule:function () {
        this.small++;
        if (this.small > 3) {
            this.small = 0;
            this.big++;
        }
        else {
            if (this.big === 17){
                if (this.small > 2) {
                    this.small = 0;
                    this.big++;
                }
            }
        }
    }
};

//文件查询器
function Interrogator(opt) {
    this.dir_path = opt.dir_path;
    this.big = opt.big;
    this.small = opt.small;
    this.ext = opt.ext;
    this.file_url = null;
    this.name_rule = opt.name_rule;

    this.get_file_path = function (){
        let find_img_promise = new Promise((resolve,reject) => {
            console.log(this.dir_path);
            fs.exists(this.dir_path,(exists) => {
                if (!exists) {
                    // throw new Error(`不存在${this.dir_path}`);

                    reject();
                }
                else {
                    resolve();
                }
            })
        });

        find_img_promise
            //文件夹存在则进行文件查询
            .then(() => {
                //合并文件路径和文件名
                // let file_name = this.name + this.ext;
                let file_name = `/${this.big}_${this.small}${this.ext}`;
                this.file_url = this.dir_path + file_name;
                console.log(this.file_url);

                let exists_promise = new Promise((resolve,reject) => {
                    fs.exists(this.file_url,(exists) => {
                        if (!exists) {
                            // throw new Error(`不存在${file_name}`);
                            reject(file_name);
                        }
                        else {
                            resolve();

                        }
                    });
                });

                //文件存在则进行前缀替换和存入数据库homepage_img
                exists_promise
                    .then(() => {
                        // 声明的reg用于将文件路径的前缀替换成服务器地址
                        let reg = /(.+)\/myVps/,
                            httpProxy = "http://localhost:8080",
                            file_url;

                        file_url = this.file_url.replace(reg,httpProxy);
                        console.log(file_url);

                        //插入homepage_img数据库
                        insert(file_url);

                    },(file_name) => {
                        throw new Error(`不存在${file_name}`);
                    });

            },() => {
                throw new Error(`不存在${this.dir_path}`);
            });

    }
}

let insert = (file_url) => {
    let save_url_promise = new Promise((resolve,reject) => {
        let size = "small";

        if (interrogator.small === 0) {
            size = "big";
        }

        let img_url = new vps_list({
            url:file_url,
            size:size
        });

        img_url.save((err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log(`已保存:${file_url}`);
                resolve();
            }
        });

    });

    save_url_promise
        .then(() => {
            //执行文件名递增
            interrogator.name_rule();
            //递归查询
            interrogator.get_file_path();
        },(err) => {
            throw err;
        })

};

//new一个img文件路径查询器
let interrogator = new Interrogator(homepage);
//初始执行
interrogator.get_file_path();

