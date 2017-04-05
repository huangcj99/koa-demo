//验证器构造函数
let Validator = function(){
	this.cache = [];
};

//添加所需要的验证方法
Validator.prototype.addMethod = function (dom,rule,errorMsg){
	let ary = rule.split(":");
	this.cache.push(function(){
		let strategy = ary.shift();
		ary.unshift(dom.value);
		ary.push(errorMsg);
		return formMethod[strategy].apply(dom,ary);
	});
};

//执行验证器的每一个方法如果有错误则返回相应错误的信息
Validator.prototype.formValidated = function(){
	for (let i = 0,len = this.cache.length; i < len; i++){
		let msg = this.cache[i]();
		if(msg){
			return msg;
		}
	}
};

//存放需要验证的方法
let formMethod = {
	isNonEmpty:function(value,errorMsg){
		if ($.trim(value) === "") {
			return errorMsg;
		}
	},
	isPhoneOrEmail:function(value,errorMsg){
		if (!/^1(3|4|5|7|8)\d{9}$/.test(value) && !/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)) {
			return errorMsg;
		}
	},
	isCharacter:function(value,errorMsg){
		if (!/.+/.test(value)) {
			return errorMsg;
		}
	},
	minLength:function(value,length,errorMsg){
		if (value.length < length) {
			return errorMsg;
		}
	},
	maxLength:function(value,length,errorMsg){
		if (value.length > length) {
			return errorMsg;
		}
	},
	confirmPwd:function(value,conf,errorMsg){
		if (!(value === conf)) {
			return errorMsg;
		}
	},
	confirmVerify:function(value,verify,errorMsg){
		if (!(value.toLowerCase() === verify.toLowerCase())) {
			return errorMsg;
		}
	}
};

//表单元素的获取
let $register_btn = $('.main_content .form .info .register_btn'),
	$usr = $("input[name='usr']"),
	$pwd = $("input[name='pwd']"),
	$conf = $("input[name='conf']"),
	$verify = $("input[name='verify']");

let $usr_msg = $usr.next(),
	$pwd_msg = $pwd.next(),
	$conf_msg = $conf.next(),
	$verify_msg = $verify.next().next();

//4位的随机验证码
let	$verify_photo = $(".verify_photo"),
	$verify_photo_1 = $(".verify_photo span:nth-child(1)"),
	$verify_photo_2 = $(".verify_photo span:nth-child(2)"),
	$verify_photo_3 = $(".verify_photo span:nth-child(3)"),
	$verify_photo_4 = $(".verify_photo span:nth-child(4)"),
	letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

let crtVerify = () => {
	//设置字母随机位置和随机设置随机字母
	$verify_photo_1.css({top:parseInt(Math.random()*10),left:parseInt(Math.random()) * 25})
					.html(letter[parseInt(Math.random()*26)]);

	$verify_photo_2.css({top:parseInt(Math.random()*10),left:parseInt(Math.random() + 1) * 25})
					.html(letter[parseInt(Math.random()*26)]);

	$verify_photo_3.css({top:parseInt(Math.random()*10),left:parseInt(Math.random() + 2) * 25})
					.html(letter[parseInt(Math.random()*26)]);

	$verify_photo_4.css({top:parseInt(Math.random()*10),left:parseInt(Math.random() + 3) * 25})
					.html(letter[parseInt(Math.random()*26)]);
};

//前置装饰
Function.prototype.before = function () {
	let _self = this;
	return function () {
		if ( !validataFunc.apply(this,arguments) ) {
			console.log("有错误,不允许提交表单");
			return;
		}
		return _self.apply(this,arguments);
    }
};

let validataFunc = function () {
	//创建验证器的实例
	let validator = new Validator();

    //生成验证码字符串
    let updata_verify = `${$verify_photo_1.html()}${$verify_photo_2.html()}${$verify_photo_3.html()}${$verify_photo_4.html()}`;

	//给验证器添加验证方法
	validator.addMethod($usr[0],"isNonEmpty","请填写账户名");
	validator.addMethod($usr[0],"isPhoneOrEmail","请填写正确的手机号或邮箱");
	validator.addMethod($pwd[0],"isCharacter","请输入字符");
	validator.addMethod($pwd[0],"minLength:6","请输入大于6且小于20位数的密码");
	validator.addMethod($pwd[0],"maxLength:20","请输入大于6且小于20位数的密码");
	validator.addMethod($pwd[0],"confirmPwd:" + $conf.val(),"请确认密码");
	validator.addMethod($verify[0],"confirmVerify:" + updata_verify,"验证码不正确");

	//执行加入到验证器的方法并接收返回的msg
	let msg = validator.formValidated();

	//判断是否存在msg错误信息，没有则将表单数据post上服务器
	if (msg) {
		//账户名
		if (msg === "请填写账户名" || msg ==="请填写正确的手机号或邮箱") {
			$usr.val("");
			$usr_msg.html(msg);
		}

		//密码
		if (msg === "请输入字符" || msg === "请输入大于6且小于20位数的密码") {
			//到密码部分验证则清除之前的警告提示
			$usr_msg.html("");

			$pwd.val("");
			$pwd_msg.html(msg);
		}

		//确认密码
		if (msg === "请确认密码") {
			//同上，消除警告提示
			$usr_msg.html("");
			$pwd_msg.html("");
			$verify_msg.html("");

			$pwd.val("");
			$conf.val("");
			$verify.val("");
			$conf_msg.html(msg);
		}

		//验证码
		if (msg === "验证码不正确") {
			//同上，消除警告提示
			$usr_msg.html("");
			$pwd_msg.html("");
			$conf_msg.html("");

			$verify.val("");
			$verify_msg.html(msg);
		}

		return false;
	}
	else {
		return true;
	}

};

let submitForm = function () {
    let usr = $usr.val(),
        pwd = $pwd.val();

    let url = `http://localhost:8080/account/register/${usr}?usr=${usr}&pwd=${pwd}`;
    //post数据到服务器
    $.post(url,(res) => {
        let resText = JSON.parse(res),
            $register_success = $('.register_success');
        console.log(res);
        if (resText.status){
            //插入注册成功并跳转页面
            $register_success.html(resText.info);
            location.href = "http://localhost:8080/states/charmingHui/src/html/login.html";
        }
        else {
            //插入注册失败的info并清空表单
            $register_success.html(resText.info);
            //清空数据操作
            $usr.val("");
            $pwd.val("");
            $conf.val("");
            $verify.val("");
            $usr_msg.html("");
            $pwd_msg.html("");
            $conf_msg.html("");
            $verify_msg.html("");
            setTimeout(() => {
                $register_success.html("");
            },2000)
        }
    })
};

submitForm = submitForm.before(validataFunc);

//点击创建随机验证码
$verify_photo.on("click",() => {
	crtVerify();
}).trigger("click");

//点击验证表单信息，并确定是否提交数据到服务器
$register_btn.on('click',() => {
    submitForm();
});

