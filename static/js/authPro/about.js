// 加一个 $(function{});  只有当当前页面全部demo全部被加载完之后，才会执行里面的代码。 否则html,css,js就是并行的

$(function () {

    var updatePsdhBtn = $("#update_psd");

    // 修改密码
    updatePsdhBtn.click(function () {
            //获取元素

        var firstPsd = $("#id_password").val().trim();
        var confirmPsd = $("#id_password_repeat").val().trim();
        // 确认两个密码
        if(firstPsd.length > 0 && confirmPsd.length >0){
            if(firstPsd == confirmPsd){
                $.post({
                    url:"/auth/updatepsd/",
                    data:{
                        "newpsd":firstPsd,
                    },
                    success:function (data) {
                        fAlert.alertNewsSuccessCallback("密码修改成功", "OK", () => {
                         window.location.href="/";
                        });

                    },
                    error: function () {
                        console.log(" update password error");
                    }
                })
            }
            else{
                alert("两次密码不一致");
            }
        }else{
            alert("密码不合规范");
        }




    });







 function disable_func(){
     return false;
  }























});











