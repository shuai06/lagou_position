$(document).ready(function(){

	//  .caseWordCloud   词云

    // 城市
	var barCharts1 = echarts.init(document.getElementById('monthly'));
	option3 = {
		title : {
			text: '城市分布',
			// subtext: '纯属虚构',
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
    pieChart5.setOption(option5);

    //
    var barCharts6 = echarts.init(document.getElementById('xzqmonthly'));
	option6 = {
		title : {
			text: '城市分布',
			// subtext: '纯属虚构',
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


