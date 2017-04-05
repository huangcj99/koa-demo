/**
 * Created by gunjoe on 2017/2/4.
 */
let session_url = `http://localhost:8080/account/sessionLogin`;
$.post(session_url,(res) => {
    let resText = JSON.parse(res);
    //若session_id没过期则跳转至主页面
    if (resText.status){
        location.href = "http://localhost:8080/states/charmingHui/src/index.html";
    }
});

let $usr = $("input[name='usr']"),
    $pwd = $("input[name='pwd']"),
    $login_btn = $(".login_btn");

$login_btn.on('click',() => {
    let url = `http://localhost:8080/account/login/${$usr.val()}?usr=${$usr.val()}&pwd=${$pwd.val()}`;
    $.post(url,(res) => {
        let resText = JSON.parse(res),
            $login_success = $('.login_success');
        if (resText.status){
            $login_success.html(resText.info);
            location.href = "http://localhost:8080/states/charmingHui/src/index.html";
        }
        else {
            $login_success.html(resText.info);
        }
    });

});