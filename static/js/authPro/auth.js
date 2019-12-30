// 加一个 $(function{});  只有当当前页面全部demo全部被加载完之后，才会执行里面的代码。 否则html,css,js就是并行的

$(function () {
//获取元素
let $loginBtn = $('.login-btn');
// 获取输入框与密码框的值
let $telIpt = $("input[name=telephone]");
let $pwdIpt = $("input[name=password]");
let $smsBtn = $(".sms-captcha");
let $remember = $("input[name=remember]");
let $graphBtn = $(".captcha-graph-img");
let $registerBtn = $(".register-btn");

let reg = /^1[3-9][0-9]\d{8}$/;

//登录按钮的点击事件
$loginBtn.click(function (ev) {
    // 禁止掉默认事件
     ev.preventDefault();

    // 通常 会在前端验证一次，后台验证一次
    // .val 获取输入框的值
    let telVal = $telIpt.val();
    let pwdVal = $pwdIpt.val();
    // .trim去空格
    //如果手机号输入框内容去掉空格之后没有值的话  !telval.trim()
    if (!telVal && !telVal.trim()) {
        window.message.showError("手机号不能为空");
        // 返回，下面的代码不执行
        return false;

    } else if (!reg.test(telVal)) {
        // 如果手机号格式不对
        window.message.showError('手机格式有错误');
        return false;
    }

    let data = {
        "telephone": telVal,
        "password": pwdVal,
    };
    // 是否被勾选
    // 这是jq提供的方法  就适用于 合法属性 原生JS:  hasAttribute() 必须要 标签里面有这个属性
    // is 只能判断 合法 但是 标签没有的属性
    let rStatus = $remember.is(":checked");

    // auth/login/?next=/admin   切割字符串
    let url = window.location.href;
    let next_url = url.split('=')[1];
    // 这个登录之后 ，会返回上一个页面  从哪里来回哪里去
    let referrer = document.referrer;

    // 如果勾选了
    if (rStatus) {
        // 后台会多一个remember=true
        data["remember"] = rStatus
    }
    console.log(data);
    // Ajax请求
    $.post({
        url: "/auth/login/",
        data: data,
        success: res => {
            console.log(res);
            if (res['code'] === 0) {
                // 登录成功，执行完这句，需要1.5秒console.log(1);
                window.message.showSuccess("登录成功");
                // let url = window.location.href;
                // let next_url = url.split('=')[1];
                //暂停1.5秒后再执行,防止动画不显示
                setTimeout(() => {
                    // 设置这个，Ajax就可以用redirect跳转路由了
                    if(next_url){
                        window.location.href = next_url;
                    }else if(referrer){
                        // 这个登录之后 ，会返回上一个页面
                        window.location.href = referrer;
                    }
                    else {
                        window.location.href = '/';
                    }
                }, 1500)
            } else {
                window.message.showError(res['msg']);
            }
        },
        error: err => {
            console.log(err);
            console.log(err.status + "===" + err.statusText);
        }
    });
});



//发送短信验证码
$smsBtn.click(function () {
    //获取手机号
    let telVal = $telIpt.val();
    console.log(telVal);  //第一次
    // 如果按钮禁用，就不能点击
    let sStatus = $(this)[0].hasAttribute("disabled");
    if (sStatus){
        return false;
    }
    if (telVal && telVal.trim()){
        $.get({
        url:"/auth/send-sms-captcha/",
        "data":{
            "telephone":telVal,
        },
        success: res => {
            if (res['code'] === 0){
                $(this).attr('disabled',true);
                // 获取原本的值   每循环一次，就要获取一次
                let txt = $(this).text();
                let count = 10;
                let timer = setInterval(()=>{
                    $(this).text(count);
                    count --;
                    if (count<0){
                        clearInterval(timer);
                        $(this).text(txt);
                        $(this).removeAttr("disabled");
                    }
                }, 1000)
            }
            console.log(res);
        },
        error: err => {
            console.log(err);
            console.log(err.status + "===" + err.statusText);
        }
    })
    }else {
        window.message.showInfo("手机号不能为空");
    }
});




// 刷新图形验证码
$graphBtn.click(function () {
  let $img  = $(this).find("img");
  // url 是有长度限制
  let oldSrc =$img.attr("src");
  // 加上时间戳
  let newSrc = oldSrc.split("?")[0] + '?_=' + Date.now();
  $img.attr("src", newSrc);
});


//注册按钮的点击事件
$registerBtn.click(function (ev) {
    // 一般的函数， 第一个形参为默认事件
    // 禁用默认事件   submit
    ev.preventDefault();

    $.post({
        //
        url:"/auth/register/",
        data:{
            "telephone":$telIpt.val(),
            "password":$pwdIpt.val(),
            "username":$("input[name=username]").val(),
            "password_repeat":$("input[name=password_repeat]").val(),
            "sms_captcha":$("input[name=sms_captcha]").val(),
            "graph_captcha":$("input[name=captcha_graph]").val(),
        },
        success: res => {
            // {code:0,message:'',data:null}不管这个是多少，都会跑到success里面来
            // console.log(res);
            if (res['code']===0){
                window.message.showSuccess("登录成功");
            }else {
                window.message.showError(res['msg']);
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            }
        },
        // 是有js提供的
        // 只有Ajax本身出了问题，才会跳到这里来   404=》前端url的错误    500=》服务器内部错误
        error: err => {
            console.log(err);
            // 状态码 + ，描述文本
            console.log(err.status + "===" + err.statusText);
        }
    })
});

});













