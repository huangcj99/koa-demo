/**
 *
 * Created by gunjoe on 2017/2/7.
 */
let big_img_url = "http://localhost:8080/women_clothing?size=big",
    small_img_url = "http://localhost:8080/women_clothing?size=small";

let $ul = $(".main_content > ul");


//获取数据库大图路径
$.get(big_img_url,(res) => {
    let resText = JSON.parse(res);


    //创建一个商品
    let crtCommodity = (big_img) => {
        let big = big_img,
            small_1 = null,
            small_2 = null,
            small_3 = null;

        //单个商品模板
        let commodity_model = `
        <li>
            <div class="label">买手推荐</div>
            <div class="pop_up">
                <div class="add_to_cart">添加到购物车</div>
                <div class="size"></div>
                <ul class="small_photo clear">
                    <li class="mouseover">
                        <img src=${small_1} alt="">
                    </li>
                    <li>
                        <img src=${small_2} alt="">
                    </li>
                    <li>
                        <img src=${small_3} alt="">
                    </li>
                </ul>
            </div>
            <div class="image">
                <img src=${big} alt="">
            </div>
            <div class="info">
                <p>22 OCTOBER</p>
                <p>米蓝色蝴蝶结毛领斜门襟羽绒服</p>
                <p class="price">
                    <span class="current">¥ 799</span>
                    <del>¥ 3,980</del>
                </p>
            </div>
        </li>
        `;

        $(commodity_model).appendTo($ul);
    };

    resText.forEach((big_url) => {
        crtCommodity(big_url.url);
    });
});

//使用HTML5永久存储仓库
if (!localStorage.commodity_num) {
    localStorage.commodity_num = 0;
}

$(".main_header .nav_right li:first-child").html(localStorage.commodity_num);

$ul.on("click",".add_to_cart",function() {
    localStorage.commodity_num++;

    $(".main_header .nav_right li:first-child").html(localStorage.commodity_num);

    /**
     *          接下里将商品信息抽离出来再进行localstorage的储存
     *
     *          如:localstorage.cart = 0_0=12&1_0=55...
     *
     *          商品标识可改，根据商品相关标识向服务器发送请求
     *          验证该商品数量是否还有货
     *
     *          commodity_num应保存在本地，进入购物车获取该数据，然后相应得插入到DOM节点中
     *
     *
     *
     */

});


