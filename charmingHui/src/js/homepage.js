/**
 * Created by gunjoe on 2017/2/6.
 */
//发起post请求查询session，保持页面登陆状态
let session_url = "http://localhost:8080/account/sessionLogin";

$.post(session_url,(res) => {
    let resText = JSON.parse(res);

    if (resText.status) {
        $('.main_header .register_gif img').attr({src:"http://localhost:8080/states/charmingHui/src/img/zhuceyouli.png",alt:""});
        $('.main_header .register_text a').html("我的账号");
        $('.main_header .login a').html("");
        $('.main_header .back span').html("退出").css({cursor:"pointer"});
    }
});

//点击退出，删除登陆状态
$('.main_header .back span').on("click",() => {
    let session_del_url = "http://localhost:8080/account/sessionDel";
    $.ajax({
        type:"GET",
        url:session_del_url,
        success:(res) => {
            let resText = JSON.parse(res);
            if (resText.status) {
                location.href = "http://localhost:8080/states/charmingHui/src/index.html";
            }
        }
    });

    // $.post(session_del_url,(res) => {
    //     let resText = JSON.parse(res);
    //     if (resText.status) {
    //         location.href = "http://localhost:8080/charmingHui/src/index.html";
    //     }
    // })
});

//发起get请求主页图片路径数据
let homepage_img_url = "http://localhost:8080/vps_homepage";

$.get(homepage_img_url,(res) => {
    let resText = JSON.parse(res);
    let $homepage_imgs = $('.main_container .recommend .commodity > li:not(.info) a img');
    resText.forEach((url_obj,idx) => {
        $homepage_imgs.eq(idx).attr({
            src:url_obj.url
        });
    })
});



