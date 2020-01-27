// 加一个 $(function{});  只有当当前页面全部demo全部被加载完之后，才会执行里面的代码。 否则html,css,js就是并行的

$(function () {
//获取元素
let $graphBtn = $(".captcha-graph-img");


// 刷新图形验证码
$graphBtn.click(function () {
  let $img  = $(this).find("img");
  // url 是有长度限制
  let oldSrc =$img.attr("src");
  // 加上时间戳
  let newSrc = oldSrc.split("?")[0] + '?_=' + Date.now();
  $img.attr("src", newSrc);
});





});













