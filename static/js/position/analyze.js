$(document).ready(function(){

	 // .caseWordCloud   词云
	        $.ajax({
            url: "/gen_WordCloud/",
            type:"POST",
           success: (data) => {d
               // console.log(data);
               console.log("success!!!");
                        var obj = document.getElementById("wordImg");
                        obj.src = "data:image/jpeg;base64," + callback;

           },
           error: () => {
               console.log("词云 Error");
           }

    });

	// 学历要求
    var pieChartXueli = echarts.init(document.getElementById('xueli'));
	var option2Xueli = {
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
	pieChartXueli.setOption(option2Xueli);





    // 城市
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
				interval: 0,
			   formatter:function(value)
			   {
				   return value.split("").join("\n");
			   },
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
									interval: 0,
								    formatter:function(value)
								    {
									   return value.split("").join("\n");
								    },
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




	// 工作经验
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
    pieChartJy.setOption(optionJy);




//全局设置Echrts - 根据窗口的大小变动图表
window.onresize = function(){
    barChartsCity.resize();
    pieChartJy.resize();
    pieChartXueli.resize();
};



// 中间地图

var map = new BMap.Map("mapholder");
var point = new BMap.Point(116.404, 39.915);
map.centerAndZoom(point, 10);
map.enableScrollWheelZoom(true);
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


});


