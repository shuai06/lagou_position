/*===  navMenuStart ===*/
$(() => {
  // let $navLi = $('#header .nav .menu li');
  // $navLi.click(function () {
  //   $(this).addClass('active').siblings('li').removeClass('active')
  // });
  // http://192.168.31.200:8000/course/
  let url = window.location.href;
  // http/https
  let protocol = window.location.protocol;
  // 192.168.31.200:8000
  let host = window.location.host;
  let domain = protocol + '//' + host;
  let path = url.replace(domain, '');
  console.log(path);
    console.log(url);

    let liDoms = document.querySelectorAll(' .nav .menu li');
  for (let i =0;i<liDoms.length;i++){
    let aDom = liDoms[i].querySelector('a');
    // a.href   a.getAttribute('/xxx/')
    let h = aDom.getAttribute('href');
    console.log( h);
    // console.log(aDom.href);
    // 第一种方案
    if(aDom.href===url){
      liDoms[i].className = 'active';
    }
    // 第二种方案
    // if( h===path){
    //   liDoms[i].className = 'active';
    // }

  }
});

/*===  navMenuEnd ===*/

function logErr(err) {
  console.log(err);
  console.log(err.status + "===" + err.statusText);
}

/*======= 日期格式化 =======*/
function dateFormat(pub_time) {
  // 获取当前的时间戳
  let timeNow = Date.now();
  // 获取发表文章的时间戳
  let pubTimeStamp = new Date(pub_time).getTime();
  // 获取秒
  let second = (timeNow - pubTimeStamp) / 1000;
  if (second < 60) {
    return '刚刚'
  } else if (second >= 60 && second < 60 * 60) {
    let minute = Math.floor(second / 60);
    return `${minute}分钟前`;
  } else if (second >= 60 * 60 && second < 60 * 60 * 24) {
    let hour = Math.floor(second / 60 / 60);
    return `${hour}小时前`;
  } else if (second >= 60 * 60 * 24 && second < 60 * 60 * 24 * 30) {
    let day = Math.floor(second / 60 / 60 / 24);
    return `${day}天前`;
  } else {
    let date = new Date(pubTimeStamp);
    let Y = date.getFullYear() + '/';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
    return Y + M + D + h + m;
  }
}