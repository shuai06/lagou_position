$(document).ready(function(){

	// 学历要求 char
    var pieChartXueli = echarts.init(document.getElementById('xueli'));
	var optionXueli = {
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
			textStyle:{
				color: '#ffffff'//字体颜色
				},
			data: ['不限','大专','本科','硕士','博士']
		},
		series : [
			{
				name: '学历',
				type: 'pie',
				radius : '55%',
				center: ['50%', '60%'],
				data:[
					// {value:800, name:'不限'},
					// {value:310, name:'大专'},
					// {value:1548, name:'本科'},
					// {value:300, name:'硕士'},
					// {value:50, name:'博士'},
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
	pieChartXueli.setOption(optionXueli);

	getChartXueli();
	function getChartXueli(){
		pieChartXueli.showLoading();
		$.ajax({
			url:'/charXueli/',
			type:'POST',
			success:function (data) {
				pieChartXueli.hideLoading();  //加载数据完成后的loading动画
				var dataStage = data.data;   //这里是我们后台返给我的数据
				if(dataStage['博士'] == undefined){
					dataStage['博士'] =0;
				}
				if(dataStage['硕士'] == undefined){
					dataStage['硕士'] =0;
				}
				if(dataStage['本科'] == undefined){
					dataStage['本科'] =0;
				}
				if(dataStage['大专'] == undefined){
					dataStage['大专'] =0;
				}
				if(dataStage['不限'] == undefined){
					dataStage['不限'] =0;
				}
				// 填充数据
				pieChartXueli.setOption({
					            series : [
								{
									name: '学历',
									type: 'pie',
									radius : '55%',
									center: ['50%', '60%'],
									data:[
										{value:dataStage['不限'], name:'不限'},
										{value:dataStage['大专'], name:'大专'},
										{value:dataStage['本科'], name:'本科'},
										{value:dataStage['硕士'], name:'硕士'},
										{value:dataStage['博士'], name:'博士'},
									],
									itemStyle: {
										emphasis: {
											shadowBlur: 10,
											shadowOffsetX: 0,
											shadowColor: 'rgba(0, 0, 0, 0.5)'
										}
									}
								}
							],

				});

				// console.log("获取char city success");
			},
			error:function () {
				console.log("获取char city 失败！");
			}
		})
	}

	// 学历pie的点击事件
	pieChartXueli.on('click', function(params){
	var xueliName = params.name;
	if(isShowMore==false){
        $("#upAndD").attr("title","展开").css("transform","rotateZ(0)");
        isShowMore=true;
	}
	getDataListXueliandJY( xueliName, "学历");
	});


    // 城市 char
	var barChartsCity = echarts.init(document.getElementById('city'));
	optionCity = {
		tooltip: {},
		legend: {
		},
		xAxis: {
			type: 'category',
			axisLabel : {
				textStyle: {
					color: '#fff'
				          },
				// rotate:30,
				interval: 0,
			   // formatter:function(value)
			   // {
				//    return value.split("").join("\n");
			   // },
			},

			data: [],  //ajax
		},
		yAxis: {
			type: 'value',
			axisLabel : {
				formatter: '{value}',
				textStyle: {
					color: '#fff'
				          }
                        }

		},
		series: [{
			data: [], //ajax
			type: 'bar'
		}],
		};

	barChartsCity.setOption(optionCity);
	getChartCity();

	function getChartCity(){
		var city_list = [];
		var city_count_list = [];

		barChartsCity.showLoading();
		$.ajax({
			url:'/charCity/',
			type:'POST',
			success:function (data) {
				barChartsCity.hideLoading();  //加载数据完成后的loading动画
				var dataStage = data.data;   //这里是我们后台返给我的数据
				// console.log(dataStage);
				for(var i in dataStage) {
					city_list.push(dataStage[i].city);
					city_count_list.push(dataStage[i].city_count);

				}
				// console.log(city_list);
				// console.log(city_count_list);
				// 填充数据
				barChartsCity.setOption({
							xAxis: {
								type: 'category',
								axisLabel : {
									textStyle: {
										color: '#fff'
											  },
									// rotate:30,
									interval: 0,
								    // formatter:function(value)
								    // {
									//    return value.split("").join("\n");
								    // },
											},
								data: city_list,  //ajax
								},
							series: [{
								data: city_count_list, //ajax
								type: 'bar'
								}],

				});

				// console.log("获取char city success");
			},
			error:function () {
				console.log("获取char city 失败！");
			}
		})
	}

	// 城市pie的点击事件
	barChartsCity.on('click', function(params){
	var xueliName = params.name;
	if(isShowMore==false){
        $("#upAndD").attr("title","展开").css("transform","rotateZ(0)");
        isShowMore=true;
	}
	getDataListXueliandJY( xueliName, "城市");
	});

	// 工作经验  char
    var pieChartJy = echarts.init(document.getElementById('jingyan'));
    var optionJy = {
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
			textStyle:{
				color: '#ffffff'//字体颜色
				},
            data: ['应届毕业生','不限','1年以下','1-3年','3-5年','5-10年']
        },
        series : [
            {
                name: '经验',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                // data:[
                //     {value:335, name:'应届毕业生'},
                //     {value:310, name:'不限'},
                //     {value:234, name:'1年以下'},
                //     {value:135, name:'1~3年'},
                //     {value:1548, name:'3~5年'},
                //     {value:548, name:'5~10年'}
                // ],
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
    pieChartJy.setOption(optionJy);

    getChartWorkJy();
    function getChartWorkJy(){
		pieChartJy.showLoading();
		$.ajax({
			url:'/charWorkJy/',
			type:'POST',
			success:function (data) {
				pieChartJy.hideLoading();  //加载数据完成后的loading动画
				var dataStage = data.data;   //这里是我们后台返给我的数据
				if(dataStage['应届毕业生'] == undefined){
					dataStage['应届毕业生'] =0;
				}
				if(dataStage['不限'] == undefined){
					dataStage['不限'] =0;
				}
				if(dataStage['1年以下'] == undefined){
					dataStage['1年以下'] =0;
				}
				if(dataStage['1-3年'] == undefined){
					dataStage['1-3年'] =0;
				}
				if(dataStage['3-5年'] == undefined){
					dataStage['3-5年'] =0;
				}
				if(dataStage['5-10年'] == undefined){
					dataStage['5-10年'] =0;
				}
				if(dataStage['10年以上'] == undefined){
					dataStage['10年以上'] =0;
				}
				// 填充数据
				pieChartJy.setOption({
							series : [
							{
								name: '经验',
								type: 'pie',
								radius : '55%',
								center: ['50%', '60%'],
								data:[
									{value:dataStage['应届毕业生'], name:'应届毕业生'},
									{value:dataStage['不限'], name:'不限'},
									{value:dataStage['1年以下'], name:'1年以下'},
									{value:dataStage['1-3年'], name:'1-3年'},
									{value:dataStage['3-5年'], name:'3-5年'},
									{value:dataStage['5-10年'], name:'5-10年'},
									{value:dataStage['10年以上'], name:'10年以上'},
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

				});

				// console.log("获取char city success");
			},
			error:function () {
				console.log("获取char city 失败！");
			}
		})
	}

	// 经验pie的点击事件
	pieChartJy.on('click', function(params){
	var xueliName = params.name;
	if(isShowMore==false){
        $("#upAndD").attr("title","展开").css("transform","rotateZ(0)");
        isShowMore=true;
	}
	getDataListXueliandJY( xueliName, "经验");
	});




//全局设置Echrts - 根据窗口的大小变动图表
window.onresize = function(){
    barChartsCity.resize();
    pieChartJy.resize();
    pieChartXueli.resize();
    wc.resize();
};



// 中间地图
var map = new BMap.Map("mapholder");
var point = new BMap.Point(108.000, 39.915);
map.centerAndZoom(point, 5);
// map.enableScrollWheelZoom(true);
map.enableInertialDragging();
map.enableContinuousZoom();


// 地图主题  midnight   googlelite     pink     grayscale  bluish   light  dark  normal
changeMapStyle('normal');
function changeMapStyle(style){
	var mapStyle ={
		// features: ["road","building","water","land"],//隐藏地图上的"poi",
		style : style,
	};
	map.setMapStyle(mapStyle);
}


// js2wordcloud 生成词云
var wc = new Js2WordCloud(document.getElementById('wordCloudImg'));
wc.setOption({
    tooltip: {
        show: true
    },
    list: [['谈笑风生', 8], ['弹性工作', 8], ['六险一金', 7], ['双休', 7], ['年薪百万', 6], ['大牛带飞', 6],['免费水果',10], ['下午茶',5],['免费体检',6],['无限调休',6]],
    color: '#15a4fa',
	  "backgroundColor": '#082054', // the color of canvas
});









/**
 * 职位列表：
 *
 * **/

//箭头按钮，拉大拉小
//列表信息的展开
var isShowMore=true;
$("#upAndD").on("click",function () {
    $(".showCaseInfo").css("transition","0.5s");
    if(isShowMore){
        $("#upAndD").attr("title","收起").css("transform","rotateZ(180deg)");
        $(".showCaseInfo").css("height","700px");
        isShowMore=false;
    }else{
        $("#upAndD").attr("title","展开").css("transform","rotateZ(0)");
        $(".showCaseInfo").css("height","300px");
        isShowMore=true;
    }

});



//关闭按钮
$("#closeList").on("click", function(){
	 $(".showCaseInfo").css("height","0");
//    	 $(".showCaseInfo").css("transition","none");
//    	 $(".showCaseInfo").slideDown();
});


function getDataListXueliandJY(parm, typeName){
    $.ajax({
        url: "/get_xueli/",   //
        type: "POST",
        dataType: "json",
		data:{
        	"parm":parm,
			"typeName":typeName,
		},
        success: function (data) {
//        	console.log(data);
            if (data) {
            	// 填充table数据
                var tableContents="   <thead>  <tr><th>职位</th><th>公司</th><th>城市</th><th>薪资</th><th>学历</th><th>经验</th> <th>详情</th></tr>  </thead><tbody >";

                for(var i = 0;i<data.length;i++){
                    var item = data[i]['fields'];

                   		    tableContents+= "<tr>";

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
                            tableContents+="<td style='cursor: pointer'>"+ "查看" +"</td>";
                            tableContents += "</tr>";

            }
                tableContents += "</tbody>";
            $("#theadAndTbody").html(tableContents);
        }
        if(data.length ==0){
                tableContents = "<tr> <td></td> <td></td><td></td><td>查询数据为空!</td>  <td></td> <td></td> <td></td> </tr>  </tbody>";
                $("#theadAndTbody").html(tableContents);
                }
        slideShowWin(data.length);
        },
        error : function(){
            console.log("首页职位列表ajax error");
          }
    });
}


//从不出现到滑上来
function slideShowWin(listLength){
	$(".showCaseInfo").css("transition","0.5s");
	if(listLength<=10){
		$(".showCaseInfo").css("height","auto");
		$("#upAndD").hide();
	}
	else{
		$(".showCaseInfo").css("height","300px");
		$("#upAndD").show();
	}


}








































});

