// var map;
// var initM;
// var OpenLayers;
// var contentWindow;
// var videoData;
//
// var isCheckEvent =false;
// var currentType;
// var currentData;
// var yuntaistatus;
// /**
//  *
//  * @type {{}}
//  */
// var commandhome = {
//     currentData : '', // 当前操作的摄像头信息
//     yulanZhuTuPath : "",// 预览抓图路径
//     huifangDownloadPath : "",// 回放录像下载路径
//     huifangZhuTuPath : "",// 回放抓图路径
//     currentType : "",// 当前操作 实时监控还是历史回放
//     isCheckEvent : false,// 是否检查设备加载环境
//     getCamera : function(){
//         var data = videoData;
//         // 将摄像头叠加在地图上
//         if(map.getLayersByName("资源中心Camera").length == 0){
//             commandhome.Camerareadlayer = new OpenLayers.Layer.Vector("资源中心Camera",{});
//             map.addLayer(commandhome.Camerareadlayer );
//         }
//         commandhome.Camerareadlayer.removeAllFeatures();
//         // 叠加地图对象
//         var camera = [];
//         for (var i = 0; i < data.length; i++) {
//             var item = data[i];
//             var point = new OpenLayers.Geometry.Point(item.x,item.y);
//             var feature = new OpenLayers.Feature.Vector(point);
//             var style = {
//             		externalGraphic: "../../../images/cx_shan.png",
//                     cursor: "pointer",
// //                    label:labelName,
//                     graphicYOffset:-10,
//                     graphicHeight: 150,
//                     graphicWidth: 150,
//                     graphicYOffset:-30,
//                     rotation : parseFloat(data[i].angle)
// //                    fontColor:"#2e76ee",
// //                    fontSize:'16px',
// //                    fontWeight:'bold',
// //                    fontFamily:'微软雅黑',
// //                    labelOutlineColor: '#ffffff',
// //                    labelOutlineWidth: 5
//             };
//             feature.style = style;
//             feature.hjk =  item;
//             camera.push(feature);
//         }
//         commandhome.Camerareadlayer.addFeatures(camera);
//         map.setLayerIndex(map.getLayersByName("资源中心Camera")[0],map.layers.length-1);
//         // 轮播视频
//         commandhome.initLunbo(videoData[0]);
//     },
//     /**
//      * 实时监控
//      */
//     realMonitor : function(data){
//         //console.log(data);
//         $(".histroyVideo").hide();
//         currentType = "realMonitor";
//         commandhome.camaraLogin(data);
//     },
//     // 设备登录
//     camaraLogin : function(data){
//         // 首先登陆该摄像头
//         var szIP = data.ip,
//             szPort = data.port,
//             szUsername = data.username,
//             szPassword =  data.password;
//
//         if ("" == szIP || "" == szPort) {
//             return;
//         }
//         var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
//             success: function (xmlDoc) {
//                 // showOPInfo(szIP + " 登录成功！");
//                 //console.log(szIP + " 登录成功！");
//                 currentData = data;
//                 if(currentType == "realMonitor"){
//                     clickStartRealPlay(data); // 开始预览
//                 }else{
//                     clickStartPlayback(data);// 开始回放
//                 }
//                 // 获取抓图路径
//                 clickGetLocalCfg();
//             },
//             error: function () {
//                 //showOPInfo(szIP + " 登录失败！");
//                 //console.log(szIP + " 登录失败！");
//             }
//         });
//
//         if (-1 == iRet) {
//             //   showOPInfo(szIP + " 已登录过！");
//             //console.log(szIP + " 已登录过！");
//             if(currentType == "realMonitor"){
//                 clickStartRealPlay(data); // 开始预览
//             }else{
//                 clickStartPlayback(data);// 开始回放
//             }
//         }
//     },
//     // 轮播视频
//     initLunbo : function(datas){
//         if(!isCheckEvent){
//             checkEnviroment();
//         }
//           commandhome.realMonitor(datas);
//         var num =0;
//         // 轮播
//         setInterval(function () {
//             if(num == videoData.length-1){
//                 num = 0;
//             }else{
//                 num ++;
//             }
//             //console.log(num);
//             commandhome.realMonitor(videoData[num]);
//         },15000);
//     },
//     /**
//      * 视频开始
//      * 加载摄像头信息
//      */
//     initCamera : function() {
//         videoData = [];
//         $.ajax({
//             url: baseurl + "Camera.action",
//             type: "post",
//             timeout: 30000,
//             data: {method: "hibernate", paramts: ""},
//             dataType: "json",
//             success: function (data) {
//                 for (var i = 0; i < data.length; i++) {
//                     var video = {
//                         "id": data[i].id,
//                         "x": data[i].x,
//                         "y": data[i].y,
//                         "address": data[i].address, // 摄像头位置
//                         "high": data[i].high, // 摄像头高度
//                         "ip": data[i].ip,//云台IP
//                         "username": data[i].username,
//                         "password": data[i].password,
//                       //  "ip":"10.5.130.60",
//                       //  "username":"admin",
//                       //  "password":"pr123456",
//                         "name": data[i].name,
//                       //  "port": data[i].port,
//                         "port": "80",
//                      //   "channelId": data[i].channelid, // channelId :通道号从数据库获取
//                         "channelId": 1,//parseFloat(i)+1, // channelId :通道号从数据库获取
//                         "cloudplat": data[i].angle,
//                         "angle" : data[i].angle
//                     };
//                     videoData.push(video);
//                 }
//                 // 叠加摄像头
//                 commandhome.getCamera();
//             },
//             error: function (XHR, errorThrown) {
//             }
//         });
//     },
//     /**
//      * 加载人员信息
//      */
//      initzfy:function(){
//     //获取人员列表
//     var time = publicD().Year +"-"+publicD().Month +"-"+publicD().Day;
//     $.ajax({
//         url:baseurl+"UserManager.action",
//         type:"post",
//         data:{method:"selectPeoleLonlat",time:time},
//         dataType : "json",
//         success:function (data) {
//             var result = data.resurlt;
//             if(map.getLayersByName("执法仪").length == 0) {
//                 commandhome.Zfylayer = new OpenLayers.Layer.Vector("执法仪", {});
//                 map.addLayer(commandhome.Zfylayer);
//                 commandhome.Zfylayer.removeAllFeatures();
//                 // 叠加地图对象
//                 var camera = [];
//                 for (var i = 0; i < result.length; i++) {
//                     if(result[i]!=null){
//                         var item = result[i];
//                         var lonlat = item.lonlat;
//                         var x = lonlat.split(",")[0];
//                         var y = lonlat.split(",")[1];
//                         var point = new OpenLayers.Geometry.Point(x,y);
//                         var feature = new OpenLayers.Feature.Vector(point);
//                         var style = {
//                             strokeColor: "blue",
//                             fillColor: "blue",
//                             externalGraphic: "../../../images/jwry.png",
//                             cursor: "pointer",
//                             graphicHeight: 25,
//                             graphicWidth: 25,
//                             // label: item.name,
//                             graphicYOffset: -30,
//                             fontColor: "#467fb8"
//                         };
//                         feature.style = style;
//                         feature.hjk = item;
//                         camera.push(feature);
//                     }
//                 }
//                 commandhome.Zfylayer.addFeatures(camera);
//                 map.setLayerIndex(map.getLayersByName("执法仪")[0],map.layers.length-1)
//             }
//         },
//         error:function () {
//         }
//     });
// }
// };
//
// function toolsControl(){
//     map.setCenter(new CreatMap.LonLat(113.71999,36.59626),10);
// }
// // 读XML获取图层叠加
// function loXml(){
//     $.ajax({
//         url : "../../../config/services.xml",
//         type : "get",
//         timeout : 30000,
//         success : function(data) {
//             var areasurl = $(data).find("comuteArea").find("url").text().toString();
//              var djq ={
//                     url : $(data).find("sydjq").find("url").text().toString(),
//                     // num:$(data).find("sydjq").find("num").text().toString(),
//                     codefiled:$(data).find("sydjq").find("codefiled").text().toString()
//                 }
//             mapAddLayer("djq",djq.url,/*djq.num,*/djq.codefiled);
//         },error : function(a,b,c){
//             //console.log(a,b,c);
//         }
//     });
// }
// // 叠加图层
// function mapAddLayer(name,url,num,profile){
//     var param = {};
//     var region = {};
//     // if(role == 2 || role == 3){
//     //     $.each(publicCityList,function(i,v){
//     //         $.each(v.team,function(x,z){
//     //             if(z.name == institute){
//     //                 region = v;
//     //                 return false;
//     //             }
//     //         });
//     //     });
//     //     var layernum = num.split(",");
//     //     for(var i = 0; i< layernum.length; i++){
//     //         param[layernum[i]] = ''+profile+' like \''+region.code+'%\'';
//     //     }
//     // }
//     var gdLayer = new CreatMap.Layer.ArcGIS93Rest(name, url
//         + "/export", {
//         layers : "show:"/*+num*/,
//         layerDefs : JSON.stringify(param),
//         transparent : true
//     });
//     // gdLayer.setVisibility(false);
//     map.addLayer(gdLayer);
//     map.layers[0].setVisibility(false);
//     map.layers[1].setVisibility(false);
//     map.layers[2].setVisibility(false);
//     map.layers[3].setVisibility(false);
//     map.layers[4].setVisibility(false);
//     map.layers[5].setVisibility(false);
//     map.setCenter(new CreatMap.LonLat(113.71999,36.59626),10);
// }
//
//
// $(function(){
//     initM.loadXmlFile(loXml);
//     var initmap = setInterval(function () {
//         if (map!=null){
//             JS.Engine.on({
//                 msgData: function(kb){//侦听一个channel
//                 	var xzq, type;
//         			var kbs = eval("(" + kb + ")");
//         			if(kbs.type=="xcrecord"){
//         				type = kbs.type;
//         				xzq = kbs.xzq;
//         				source = kbs.source;
//         				parent.$("#alertmessage").html(alertboxs(type, source));
//         			}else{
//         				if(role =="1"){
//                             type = kbs.type;
//                             source = kbs.source;
//                             parent.$("#alertmessage").html(alertboxs(type,source));
//                         }else if(role ="2" ){
//                             type = kbs.type;
//                             xzq = kbs.xzq;
//                             source = kbs.source;
//                             if(institute == xzq){
//                                 parent.$("#alertmessage").html(alertboxs(type,source));
//                             }
//                         }else if(role ="deal" ){
//                         	type = kbs.type;
//                         	xzq = kbs.xzq;
//                         	source = kbs.source;
//                         	if(institute == xzq){
//                         		parent.$("#alertmessage").html(alertboxs(type,source));
//                         	}
//                         }
//         			}
//                     parent.$(".cometmessage").animate({"bottom":"20px"});
//                 }
//             });
//             JS.Engine.start('../../../conn');
//             commandhome.initCamera();
//             commandhome.initzfy();
//             clearInterval(initmap);
//         }
//     },100);
//
//
// //    弹窗增大变小的按钮 ^^^
//     //列表信息的展开
//     var isShowMore=true;
//     $(".showMore img").on("click",function () {
//         $(".showCaseInfo").css("transition","0.5s");
//         if(isShowMore){   //点击向上展开
//             $(".showMore img").attr("title","收起").css("transform","rotateZ(180deg)");
//             $(".showCaseInfo").css("height","700px");
//             isShowMore=false;
//         }else{  // 点击向下
//             $(".showMore img").attr("title","展开").css("transform","rotateZ(0)");
//             $(".showCaseInfo").css("height","300px");
//             isShowMore=true;
//         }
//     });
//
//     //关闭按钮
//     $("#closeList").on("click", function(){
//     	 $(".showCaseInfo").css("height","0");
// //    	 $(".showCaseInfo").css("transition","none");
// //    	 $(".showCaseInfo").slideDown();
//     });
//
//

$(document).ready(function(){
    var pieChart1 = echarts.init(document.getElementById('divPlugin'));
    var option1 = {
        // title : {
        //     text: '工作经验',
        //     subtext: '纯属虚构',
        //     x:'center'
        // },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['应届毕业生','不限','1年以下','1~3年','3~5年','哈哈哈   5~10年 ']
        },
        series : [
            {
                name: '经验',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'应届毕业生'},
                    {value:310, name:'不限'},
                    {value:234, name:'1年以下'},
                    {value:135, name:'1~3年'},
                    {value:1548, name:'3~5年'},
                    {value:548, name:'5~10年'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    pieChart1.setOption(option1);

    // 城市
	var barCharts1 = echarts.init(document.getElementById('monthly'));
	option3 = {
		title : {
			text: '城市分布',
			subtext: '纯属虚构',
			x:'center'
		},
		tooltip: {},
		legend: {
		},
		xAxis: {
			type: 'category',
			data: ['北京', '成都', '上海', '武汉', '南京', '深圳', '西安']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: [120, 200, 150, 80, 70, 110, 130],
			type: 'bar'
		}]
		};
	barCharts1.setOption(option3);

	//
    var pieChart2 = echarts.init(document.getElementById('EX-aj'));
	var option2 = {
		title : {
			text: '学历情况',
			x:'center'
		},
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['不限','大专','本科','硕士','博士']
		},
		series : [
			{
				name: '经验',
				type: 'pie',
				radius : '55%',
				center: ['50%', '60%'],
				data:[
					{value:800, name:'不限'},
					{value:310, name:'大专'},
					{value:1548, name:'本科'},
					{value:300, name:'硕士'},
					{value:50, name:'博士'},
				],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	pieChart2.setOption(option2);

	//
    var pieChart4 = echarts.init(document.getElementById('ckcharts'));
	var option4 = {
		title : {
			text: '学历情况',
			x:'center'
		},
		tooltip : {
			trigger: 'item',
			formatter: "{a} <br/>{b} : {c} ({d}%)"
		},
		legend: {
			orient: 'vertical',
			left: 'left',
			data: ['不限','大专','本科','硕士','博士']
		},
		series : [
			{
				name: '经验',
				type: 'pie',
				radius : '55%',
				center: ['50%', '60%'],
				data:[
					{value:800, name:'不限'},
					{value:310, name:'大专'},
					{value:1548, name:'本科'},
					{value:300, name:'硕士'},
					{value:50, name:'博士'},
				],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}
		]
	};
	pieChart4.setOption(option4);

	//
    var pieChart5 = echarts.init(document.getElementById('weekly'));
    var option5 = {
        // title : {
        //     text: '工作经验',
        //     subtext: '纯属虚构',
        //     x:'center'
        // },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['应届毕业生','不限','1年以下','1~3年','3~5年','哈哈哈   5~10年 ']
        },
        series : [
            {
                name: '经验',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'应届毕业生'},
                    {value:310, name:'不限'},
                    {value:234, name:'1年以下'},
                    {value:135, name:'1~3年'},
                    {value:1548, name:'3~5年'},
                    {value:548, name:'5~10年'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    pieChart5.setOption(option5);

    //
    var barCharts6 = echarts.init(document.getElementById('xzqmonthly'));
	option6 = {
		title : {
			text: '城市分布',
			subtext: '纯属虚构',
			x:'center'
		},
		tooltip: {},
		legend: {
		},
		xAxis: {
			type: 'category',
			data: ['北京', '成都', '上海', '武汉', '南京', '深圳', '西安']
		},
		yAxis: {
			type: 'value'
		},
		series: [{
			data: [120, 200, 150, 80, 70, 110, 130],
			type: 'bar'
		}]
		};
	barCharts6.setOption(option6);

});











// });