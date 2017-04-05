let http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    superagent = require('superagent'),
    cheerio = require('cheerio');

//nav中的弹窗
let pop_up_urls = [];

let getUrl = () => {
    superagent.get("http://www.mei.com/index.html")
        .end((err,pres) => {
            if (err){
                throw err;
            }
            else {
                //下载结束后将其转成html页面，并储存在$中
                let $ = cheerio.load(pres.text);
                //循环弹窗
                for (let i = 0; i < 5; i++){
                    //创建一个弹窗储存菜单链接
                    let pop_up = {};
                    pop_up.path = `../src/img/commodity_list/pop_up${i+1}`;
                    pop_up.menu_urls = [];
                    //获取menu下的a标签
                    let $menu_a = $(`#header_menu ul li:nth-child(${i + 2}) .pop_up_menu .submenu:last-child ul li a`),
                        $menu_len = $menu_a.length;
                    //循环获取a标签下的href并储存
                    for (let j = 0; j < $menu_len; j++){
                        let menu_a_obj = {};
                        menu_a_obj.path = `../src/img/commodity_list/pop_up${i + 1}/list_img${j + 1}`;
                        menu_a_obj.list_url = $menu_a.eq(j).attr("href");
                        pop_up.menu_urls.push(menu_a_obj);
                    }
                    pop_up_urls.push(pop_up);

                }
                let a = it.next();
            }
        });
};

/**
*    pop_up_urls储存菜单网址的数据结构：
*       [
*           {
*               path:"../src/img/commodity_list/pop_up${i}",
*               menu_urls:[
*                       单个menu下的一个页面的图片的存放路径和url保存
*                       {
*                           path:"`../src/img/commodity_list/pop_up${i}/list_img${j}",
*                           list_url:$menu_a.eq(j).attr("href");
*                       }
*                       ...
*               ]
*           }
*           ...
*       ]
*
* */
//用于计数pop_up_menu的网址数量

let count = 0;

//检测url是否获取成功
let show_pop_up_urls = () => {
    setTimeout(() => {
        pop_up_urls.forEach((pop_up) => {
            console.log(pop_up.path);
            pop_up.menu_urls.forEach((menu_url) => {
                console.log(menu_url.list_url);
                count++;
            });
        });
        it.next();
    },0);

};


let down_img = () => {
    setTimeout(() =>{
        console.log("开始下载图片");
        //循环每一个pop_up
        pop_up_urls.forEach((pop_up,idx) => {
            //设置每一个pop_up下载的间隔时间为400秒(根据网速设置,下同)
            setTimeout(() => {
                //判断弹窗菜单是否存在，不存在则创建
                let file_exists = () => {
                    fs.exists(pop_up.path,(exists) => {
                        if (!exists) {
                            fs.mkdirSync(pop_up.path);
                            console.log("文件创建成功");
                            getImg.next();
                        }
                        else {
                            console.log("文件已存在");
                            getImg.next();
                        }
                    })
                };

                //循环每一个pop_up下的菜单menu的每一项分类
                let cycle_menu = () => {
                    setTimeout(() => {
                        pop_up.menu_urls.forEach((menu_url, idx) => {
                            //设置每一个pop_up下的每一个menu分类的下载间隔时间为80秒
                            setTimeout(() => {

                                //判断菜单文件是否存在，不存在则创建
                                let menu_file_exists = () => {
                                    fs.exists(menu_url.path,(exists) => {
                                        if (!exists) {
                                            fs.mkdirSync(menu_url.path);
                                            console.log("菜单文件创建成功");
                                            get_menu_img.next();
                                        }
                                        else {
                                            console.log("菜单文件已存在");
                                            get_menu_img.next();
                                        }
                                    });
                                };

                                //下载菜单图片
                                let down_menu_img = () => {
                                    //请求页面
                                    superagent
                                        .get(menu_url.list_url)
                                        .end((err,pres) => {
                                            if (err) {
                                                throw err;
                                            }
                                            else {
                                                //开始抓取页面图片
                                                console.log(`开始抓取${menu_url.path}的图片`);
                                                //用cheerio转换请求回来的文档
                                                let $ = cheerio.load(pres.text),
                                                    $listProducts = $('#contentDiv > .listproduct'),
                                                    $list_len = $listProducts.length;

                                                for (let i = 0; i < $list_len; i++){
                                                    ////设置每一个pop_up下的每一个menu分类下的每一个商品的图片的下载间隔为2秒
                                                    setTimeout(() => {
                                                        //大图与小图
                                                        let $product_img = $(`#contentDiv > .listproduct:nth-child(${i + 1}) .product_img a img`),
                                                            $product_img_small = $(`#contentDiv > .listproduct:nth-child(${i + 1}) .product_content_pop span img`);

                                                        let srcs = [];
                                                        //存储大图img的src
                                                        srcs.push($product_img.attr('src'));
                                                        //储存小图img的src
                                                        for (let j = 0,len = $product_img_small.length; j < len; j++){
                                                            srcs.push($product_img_small.eq(j).attr('src'));
                                                        }

                                                        //发起get请求获取图片
                                                        for (let k = 0,len = srcs.length; k < len; k++){
                                                            http.get(srcs[k],(res) => {
                                                                let imgData = "";
                                                                res.setEncoding("binary");
                                                                res.on("data",(chunk) => {
                                                                    imgData += chunk;
                                                                });
                                                                res.on("end",() => {
                                                                    /*
                                                                    *   fileName为图片文件名
                                                                    *   imgPath为图片写入的路径
                                                                    * */
                                                                    let fileName = `${i}_${k}.jpg`,
                                                                        imgPath = path.join(menu_url.path,fileName);
                                                                    //写入图片
                                                                    fs.writeFile(imgPath,imgData,"binary",function (err) {
                                                                        if (err) {
                                                                            throw err;
                                                                        }
                                                                        // console.log("以保存");
                                                                    })
                                                                })
                                                            })


                                                        }
                                                    },2000 * i);
                                                }

                                            }
                                        })

                                };


                                function *gen_get_menu_img() {
                                    yield menu_file_exists();
                                    yield down_menu_img();
                                }

                                let get_menu_img = gen_get_menu_img();
                                get_menu_img.next();
                            },80000 * idx);
                        });
                    },0)
                };

                function *gen_get_img() {
                    yield file_exists();
                    yield cycle_menu();
                }

                let getImg = gen_get_img();
                getImg.next();

            },400000 * idx);
        });
    },0);
};

/**
*    1、获取每个pop_up的url
 *   2、检测显示pop_up的url是否获取成功
 *   3、批量下载图片
 */
function *gen() {
    //获取pop_up下的menu的每一个页面的url
    yield getUrl();
    //检测是否获取url成功
    yield show_pop_up_urls();
    yield down_img();
}

//执行爬取图片流程gen，并初始执行
let it = gen();
it.next();
