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
var markersList = [];   // 点
var markersArray = [];   // marks
var points  = [];    // 热力图用的带权值的

// 加载点数据  展示
$("#btnDis").click(function () {
    heatmapOverlay.hide();   // 移除热力图
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
function addMarker(point,gsname,zwname,money,xueli,jy, detail){
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
    content = content + "<tr><td> 详情：<a href='" + detail + "' target='_blank'>查看</a> </td></tr>";
    // content = content + "<tr><td> 位置：" + gname +"</td></tr>";
    content += "</table>";
    var infowindow = new BMap.InfoWindow(content);
            marker.addEventListener("click",function(){
                this.openInfoWindow(infowindow);
            });

    console.log("OK");
}


/*
* 点聚合
* */

// //地图缩放重新计算聚合点
// map.addEventListener("zoomend",function(){
//     markerClustersPoint(markersArray);
// });
//
// // 点聚合的函数
//  function markerClustersPoint(marks) {
//      var markerClusterer = new BMapLib.MarkerClusterer(map, {
//          markers: markersArray,
//          minClusterSize: 3,
//      });
//      // console.log(markerClusterer)
//      // 拿到所有的聚合点
//      var mk = markerClusterer._clusters;
//      var oldmk = [];
//
//      for (var i = 0; i < mk.length; i++) {
//          //小于3个marker不再进行标注
//          var mConut = mk[i]._markers.length;
//          if (3 > mConut) continue;
//          var options = [];
//
//          oldmk.push(addMarker(mk[i]._center));
//      }
//
//  }


function flush_data(data) {
    for(var i=0; i<data.length; i++){
        var res = bd_encrypt(data[i]['fields']['lon'],data[i]['fields']['lat']);
        var lo = res.bd_lng;
        var la = res.bd_lat;
        var gsname = data[i]['fields']['name'];
        var zwname = data[i]['fields']['zwname'];
        var money = data[i]['fields']['money'];
        var xueli = data[i]['fields']['xueli'];
        var jy = data[i]['fields']['gzjy'];
        // var city_counts = data[i]['fields']['city_count'];
        var point = new BMap.Point(lo, la);
        var detail = data[i]['fields']['detail_link'];

        markersList.push(point);  // 将点坐标push到点数组中
        // points.push({"lng":lo,"lat":la,"count":city_counts}); // 热力图的point权重
        addMarker(point,gsname,zwname,money,xueli,jy,detail);
    }
     map.centerAndZoom(new BMap.Point(108.000, 37.915),6);  // 缩放
     // var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markersArray});   // 聚合，数量貌似不准确？？？
    // markerClustersPoint(markersArray);   // 调用聚合函数
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


// 禁用默认回车事件
$("#btnPa").keydown(function(e) {
       if (e.keyCode == 13) {
              alert("12345....");
       }
 });

 $('#pa_form').on('keydown', function (event) {
    if (event.keyCode == 13) return false;
});

// pa数据
$("#btnPa").click(function (){
       // 如果输入框为空，alter
        input_txt = $.trim($("#zw_name").val());

        if(input_txt == null || input_txt == undefined || input_txt == "" ){
            alert("请输入要查询的职位，再进行查询");
        }else{
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
                       alert("数据爬取完成,点击展示数据查看");
                       window.location.reload();
                   },
                   error: () => {
                       console.log("Error");
                   }
            });
        }
});



// 热力图  （暂时是点击加载mark点之后，才能生成热力图）
$('#btnXuan').click(() =>{
        if(markersArray){
            for(let i=0; i<markersArray.length; i++){
                markersArray[i].remove();  // 删除 原有mark点
            }
        }else{
            alert("请先生成点数据！")
        }
        // 开始先做计算统计count
        $.ajax({
            url: "count_city/",
            type:"POST",
            // async: false,
            success:function (data) {
                console.log("begin gen hot map");
                gen_hot();    // 计算完成city_count之后再调用方法生成热力图
            }

    });

    }
);


// 生成热力图的方法
function gen_hot(){
       // 先生成点的数据
        $.ajax({
            url: "get_pos/",
            type:"POST",
            // async: false,
            success:function (data) {
                for(var i=0; i<data.length-1; i++) {
                    var res = bd_encrypt(data[i]['fields']['lon'], data[i]['fields']['lat']);
                    var lo = res.bd_lng;
                    var la = res.bd_lat;
                    var city_counts = data[i]['fields']['city_count'];
                    points.push({"lng": lo, "lat": la, "count": city_counts}); // 热力图的point权重
                }
                // 再 热力图
                                // 调用数据生成热力图
                if (!isSupportCanvas()) {
                    alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
                    }

                map.addOverlay(heatmapOverlay);
                heatmapOverlay.setDataSet({data: points, max:100});
                heatmapOverlay.show();
                map.centerAndZoom(new BMap.Point(108.000, 37.915),6);
            }
        });
}


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




/*
* 职位列表
*
*
* */


/***
* 查询所有的职位信息列表
* */
// getDataList();
// function getDataList(){
$.ajax({
    url: "/get_pos/",   // 先用这个接口
    type: "POST",
    dataType: "json",
    success: function (data) {
//        	console.log(data);
        if (data) {
            // 填充table数据
            var tableContents="   <thead>  <tr><th>职位</th><th>公司</th><th>城市</th><th>薪资</th><th>学历</th><th>经验</th> <th>详情</th></tr>  </thead><tbody >";

            for(var i = 0;i<data.length;i++){
                var item = data[i]['fields'];

                tableContents+= "<tr>";

                // if(item.ANJIANNAME == "" || item.ANJIANNAME == null)
                // 	{
                // 	nameNull = "暂无名称"
                // 	}else {
                // 		nameNull = item.ANJIANNAME;
                // 	}
                        //  职位名称   zwname
                        tableContents+="<td>"+item.zwname+"</td>";

                        // 公司名称   name
                        tableContents+="<td>"+item.name+"</td>";
                        // city
                        tableContents+="<td>"+item.city+"</td>";
                        //money
                        tableContents+="<td>"+item.money+"</td>";
                        // xueli
                        tableContents+="<td>"+item.xueli+"</td>";
                        // gzjy
                        tableContents+="<td>"+item.gzjy+"</td>";
                        // 详情
                        tableContents+="<td style='cursor: pointer'><a href='" + item.detail_link + "' target='_blank'>查看</a> </td>";
                        tableContents += "</tr>";
        }
            tableContents += "</tbody>";
        $("#theadAndTbody").html(tableContents);
    }
    if(data.length ==0){
            tableContents += "<tr> <td></td> <td></td><td></td><td>查询数据为空!</td>  <td></td> <td></td> <td></td> </tr>  </tbody>";
            $("#theadAndTbody").html(tableContents);
            }
    // slideShowWin(data.length);
    },
    error : function(){
        console.log("首页职位列表ajax error");
      }
});

// }
// 职位列表结束




// 行政区覆盖 （筛选/选择的时候可以用）
function getBoundary(){
        var bdary = new BMap.Boundary();
        bdary.get("河北省", function(rs){       //获取行政区域
            map.clearOverlays();        //清除地图覆盖物
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return ;
            }
              var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000",fillColor:""}); //建立多边形覆盖物
                map.addOverlay(ply);  //添加覆盖物
                pointArray = pointArray.concat(ply.getPath());
            }
            map.setViewport(pointArray);    //调整视野
            addlabel();
        });
    }



//一键清除
function clearAll() {
    //清除覆盖物
    map.clearOverlays();
    //清除聚合点
    markerClusterer.clearMarkers(markersArray);
}



 $(".staTuMini i").parents(".staTu").find(".alSta").stop().slideToggle();






// 职位列表 staTuMini展开/隐藏
$(".staTuMini i").on("click",function(){
    $(this).parents(".staTu").find(".alSta").stop().slideToggle();
    if($(this).hasClass("fa-chevron-down")){
        $(this).attr("class","fa fa-2x fa-chevron-up");
    }else{
        $(this).attr("class","fa fa-2x fa-chevron-down");
    }
});


//回车搜索职位
$('#searchName').bind('keydown', function (event) {
    var event = window.event || arguments.callee.caller.arguments[0];
    if (event.keyCode == 13){
        key_word = $('#searchName').val();
        searchData(key_word);
    }
});

function searchData(key_word) {
    $.ajax({
        url: "/search_key/",   // 先用这个接口
        type: "POST",
        dataType: "json",
        data:{
            "params":key_word,
        },
        success: function (data) {
    //        	console.log(data);
            if (data) {
                // 填充table数据
                var tableContents="   <thead>  <tr><th>职位</th><th>公司</th><th>城市</th><th>薪资</th><th>学历</th><th>经验</th> <th>详情</th></tr>  </thead><tbody >";

                for(var i = 0;i<data.length;i++){
                    var item = data[i]['fields'];

                    tableContents+= "<tr>";

                    // if(item.ANJIANNAME == "" || item.ANJIANNAME == null)
                    // 	{
                    // 	nameNull = "暂无名称"
                    // 	}else {
                    // 		nameNull = item.ANJIANNAME;
                    // 	}
                            //  职位名称   zwname
                            tableContents+="<td>"+item.zwname+"</td>";

                            // 公司名称   name
                            tableContents+="<td>"+item.name+"</td>";
                            // city
                            tableContents+="<td>"+item.city+"</td>";
                            //money
                            tableContents+="<td>"+item.money+"</td>";
                            // xueli
                            tableContents+="<td>"+item.xueli+"</td>";
                            // gzjy
                            tableContents+="<td>"+item.gzjy+"</td>";
                            // 详情
                            tableContents+="<td style='cursor: pointer'><a href='" + item.detail_link + "' target='_blank'>查看</a> </td>";
                            tableContents += "</tr>";
            }
                tableContents += "</tbody>";
            $("#theadAndTbody").html(tableContents);
        }
        if(data.length ==0){
                tableContents += "<tr> <td></td> <td></td><td></td><td>查询数据为空!</td>  <td></td> <td></td> <td></td> </tr>  </tbody>";
                $("#theadAndTbody").html(tableContents);
                }
        // slideShowWin(data.length);
        },
        error : function(){
            console.log("首页职位列表ajax error");
          }
});


}
























});














