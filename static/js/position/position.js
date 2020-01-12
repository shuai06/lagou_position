$(() => {

// 百度地图API功能
var map = new BMap.Map("container");
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 10);
map.enableScrollWheelZoom(true);
map.enableInertialDragging();
map.enableContinuousZoom();

var gname = "";
var geoc = new BMap.Geocoder();    // 逆地址解析
// 城市列表工具条
var size = new BMap.Size(10, 20);
map.addControl(new BMap.CityListControl({
    anchor: BMAP_ANCHOR_TOP_LEFT,
    offset: size,
}));

heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":20, "visible":true, "opacity":70});

var data2 = '';
var markersList = [];   // points
var markersArray = [];   // marks
var points  = [];    // 热力图用的带权值的


// 加载点数据  展示
$("#ccc").click(function () {
    heatmapOverlay.hide();
    $.ajax({
        url: "get_pos/",
        type:"POST",
        // async: false,
        success:function (data) {
            data2 = data;
            flush_data(data2)
        }

    });
});


//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = gg_lng, y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    // array.push(bd_lng );
    // array.push(bd_lat );
    //
   return {
       bd_lat: bd_lat,
       bd_lng: bd_lng
    };
    // return array;
}


// 编写自定义函数,创建标注
function addMarker(point,gsname,zwname,money,xueli,jy){
    var marker = new BMap.Marker(point);
    map.addOverlay(marker);
    markersArray.push(marker);

    // gname = reverseAddress(point);

    var content = "<table>";
    content = content + "<tr><td> 公司：" +gsname+ "</td></tr>";
    content = content + "<tr><td> 职位：" +zwname+"</td></tr>";
    content = content + "<tr><td> 薪资：" +money+"</td></tr>";
    content = content + "<tr><td> 学历：" +xueli+"</td></tr>";
    content = content + "<tr><td> 经验：" +jy+"</td></tr>";
    // content = content + "<tr><td> 位置：" + gname +"</td></tr>";
    content += "</table>";
    var infowindow = new BMap.InfoWindow(content);
            marker.addEventListener("click",function(){
                this.openInfoWindow(infowindow);
            });

    console.log("OK");
}

// diao yong
markerClustersPoint(markersList);

//地图缩放重新计算聚合点
map.addEventListener("zoomend",function(){
    markerClustersPoint(markersList);
});

// 点聚合的函数
 function markerClustersPoint(marks) {
     var markerClusterer = new BMapLib.MarkerClusterer(map, {
         markers: markersList,
         minClusterSize: 3,
     });
     // console.log(markerClusterer)
     // 拿到所有的聚合点
     var mk = markerClusterer._clusters;
     var oldmk = [];

     for (var i = 0; i < mk.length; i++) {
         //小于3个marker不再进行标注
         var mConut = mk[i]._markers.length;
         if (3 > mConut) continue;
         var options = [];

         oldmk.push(addMarker(mk[i]._center));
     }

 }
//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
//
// markerClusterer.addMarkers(markersList);


// var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
// markerClusterer.addMarkers(marker);

// //每次拖动屏幕，重新获取聚合点
// map.addEventListener("dragend",function(){
//     var zoom=map.getZoom();
//     console.log(zoom);
//     if(zoom>17){
//         //获取屏幕边界及四个点坐标
//         var bound=map.getBounds();
//         var minLat=bound.Xd;
//         var maxLat=bound.Vd;
//         var minLng=bound.Le;
//         var maxLng=bound.He;
//         var def=''+minLng+','+maxLat+','+maxLng+','+minLat+','+maxLng+','+maxLat+','+minLng+','+maxLat+','+minLng+','+maxLat+'';
//         //此处用的后台接口，用于获取打点数据
//         getStationsInPolygon(def,maxLng, minLng, maxLat, minLat)
//
//     }
// });



function flush_data(data) {
    for(var i=0; i<data.length-1; i++){
        var res = bd_encrypt(data[i]['fields']['lon'],data[i]['fields']['lat']);
        var lo = res.bd_lng;
        var la = res.bd_lat;
        var gsname = data[i]['fields']['name'];
        var zwname = data[i]['fields']['zwname'];
        var money = data[i]['fields']['money'];
        var xueli = data[i]['fields']['xueli'];
        var jy = data[i]['fields']['gzjy'];
        var  city_counts = data[i]['fields']['city_count'];
        var point = new BMap.Point(lo, la);

        markersList.push(point);  // 将点坐标push到点数组中
        points.push({"lng":lo,"lat":la,"count":city_counts});
        addMarker(point,gsname,zwname,money,xueli,jy);
    }


}



//关闭遮罩层
function closeWin() {
    var bgObj = document.getElementById("divbgObj");
    if (bgObj !== null)
        document.body.removeChild(bgObj);
}
//遮罩层
function alertWin() {
    var iWidth = document.documentElement.clientWidth;
    var iHeight = document.documentElement.clientHeight;

    var bgObj = document.createElement("div");
    bgObj.setAttribute("id", "divbgObj");
    bgObj.style.cssText = "position:absolute;left:0px;top:0px;width:" + iWidth + "px;height:" + Math.max(document.body.clientHeight, iHeight) + "px;filter:Alpha(Opacity=30);opacity:0.3;background-color:#000000;z-index:101;text-align:center; vertical-align:middle;";
    var bgimg = document.createElement("img");
    bgimg.setAttribute("src", '/static/images/loading_white.gif');
    bgimg.setAttribute("class", 'bdimg');
    bgObj.appendChild(bgimg);
    document.body.appendChild(bgObj);

}


// pa数据
$("#bbb").click(function (){
       heatmapOverlay.hide();
       if(markersArray){
            for(let i=0; i<markersArray.length; i++){
                markersArray[i].remove();  // delete marks
            }
        }
       alertWin();
        $(".Loading").show();

        $.ajax({
            url: "search/",
            type:"POST",
            data:{
                'zname': $("#zw_name").val(),
            },
           success: (data) => {
               // console.log(data);
               console.log("success!!!");
               closeWin();
               $("#zw_name").val("");
               alert("数据爬取完成!");

           },
           error: () => {
               console.log("Error");
           }

    });
});




// 热力图
$('#ddd').click(() =>{
        if(markersArray){
            for(let i=0; i<markersArray.length; i++){
                markersArray[i].remove();  // delete marks
            }
        }else{
            alert("请先生成点数据！")
        }
        // 生成城市数量
        $.ajax({
            url: "count_city/",
            type:"POST",
            // async: false,
            success:function (data) {


                // 调用数据生成热力图
                if (!isSupportCanvas()) {
                    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
                    }

                map.addOverlay(heatmapOverlay);
                heatmapOverlay.setDataSet({data: points, max:100});
                heatmapOverlay.show();

            }

    });

    }
);


// 判断浏览区是否支持canvas
function isSupportCanvas(){
const elem = document.createElement('canvas');
return !!(elem.getContext && elem.getContext('2d'));
}



function setGradient() {
    /*格式如下所示:
    {
        0:'rgb(102, 255, 0)',
        .5:'rgb(255, 170, 0)',
        1:'rgb(255, 0, 0)'
    }*/
    var gradient = {};
    var colors = document.querySelectorAll("input[type='color']");
    colors = [].slice.call(colors, 0);
    colors.forEach(function (ele) {
        gradient[ele.getAttribute("data-key")] = ele.value;
    });
    heatmapOverlay.setOptions({"gradient": gradient});

}

$(document).ready(function () {
    $(".navbar-nav .haha").hover(function () {
        $(".navbar-nav .haha.active").removeClass("active");
        $(this).addClass("active");
    })
})




});



















