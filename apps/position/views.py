import json
import time

import jieba
from wordcloud import WordCloud
import PIL.Image as image
import numpy as np

# from lagou_position.settings import MEDIA_ROOT  as media_path
# from lagou_position.settings import STATICFILES_DIRS as static_path

from django.shortcuts import render,reverse,redirect
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.views.generic import View
from django.http import Http404
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core import serializers
from .models import Position
from .pa import PaPosition

from django.db import connection



# 首页
# @csrf_protect
def index(request):
    return render(request, 'position/index.html')



# @csrf_protect
# @login_required()
# 获取点位置
def get_pos(request):
    if request.method == 'POST':
        positions = Position.objects.all()
        position_res = serializers.serialize('json', positions)  # 讲查询结果json序列化
        print(position_res)
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json
    else:
        # return JsonResponse({'data': 'error!'})
        pass


# 职位列表的筛选
def get_xueli(request):
    if request.method == 'POST':
        parm = request.POST.get('parm')
        typeName = request.POST.get('typeName')

        if typeName == "学历":
            positions = Position.objects.filter(xueli=parm)
        elif typeName == "经验":
            positions = Position.objects.filter(gzjy=parm)
        elif typeName == "城市":
            positions = Position.objects.filter(city=parm)

        position_res = serializers.serialize('json', positions)  # 将查询结果json序列化
        print(position_res)
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json


# @login_required()
# 点击爬取职位信息
def search(request):
    if request.method == "POST":
        canshu = request.POST.get('zname')
        # run: pa function
        # ......
        try:

            # 先判断数据表原来有没有数据
            result = Position.objects.filter()
            if result.exists():
                print("QuerySet has Data")  # 清空原来数据
                Position.objects.all().delete()

            url = " https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
            pa = PaPosition(canshu)
            # 用户输入的参数
            first_page = pa.get_json(url, 1, canshu)  # 先获取第一页数据
            total_page_count = first_page['content']['positionResult']['totalCount']  # 职位总数
            num = pa.get_page_num(total_page_count)  # 页码数
            total_info = []
            time.sleep(1)
            print("{0}相关职位总数:{1},总页数为:{2}".format(canshu, total_page_count, num))
            # 正式开始
            for num in range(1, num + 1):
                # 获取【每一页】的职位相关的信息
                page_data = pa.get_json(url, num, canshu)  # 获取响应json
                jobs_list = page_data['content']['positionResult']['result']  # 获取每页的所有gis相关的职位信息
                page_info = pa.get_page_info(jobs_list)
                # print("每一页python相关的职位信息:%s" % page_info, '\n\n')
                total_info += page_info
                print('已经爬取到第{}页，职位总数为{}'.format(num, len(total_info)))
                time.sleep(1)

                print("OK!")
        except Exception as e:
            print("Error     :   \n")
            print(e)
            jsonData = {
                "stat": "error",
            }
            return JsonResponse(jsonData)

        print("任务完成!!!")

        jsonData = {
            "stat": "success",
        }
        return JsonResponse(jsonData)



# @csrf_protect
# @login_required()
# 图表展示职位分析
def analyze(request):
    return render(request, 'position/analyze.html')


# 统计城市职位数量  （热力图用的）
# @login_required()
def count_city(request):
    if request.method == "POST":
        successData = {
            "stat": "success",
        }
        failData = {
            "stat": "fail",
        }
        city_dict = {}
        try:
            city_counts = Position.objects.values('city')
            for i in city_counts:
                if i['city'] in city_dict:
                    count = city_dict[i['city']]
                else:
                    count = 0
                count = count + 1
                city_dict[i['city']] = count
                # print(i.value())
            all_data = Position.objects.all()
            print(all_data)
            for j in all_data:
                # print(j.city)
                if j.city in city_dict.keys():  # 判断sql查出来的city, 是否在字典的key中
                    # 查出数据,update他的count的值为对应字典键值对的value
                    # 如果在，就更新数据
                    Position.objects.filter(id=j.id).update(city_count=city_dict[j.city])
            # print(city_dict)
            print("更新count_city完成!")
        except Exception as e:

            return JsonResponse(failData)
        else:
            return JsonResponse(successData)


# 测试
def other(request):
    return render(request, 'position/other.html')


# 词云
def gen_WordCloud(request):
    # with open("../../static/test.txt") as fp:
    #     text = fp.read()
    #     # print(text)
    #     # 将读取的中文文档进行分词
    #     text = trans_CN(text)
    #     mask = np.array(image.open(static_path + "/images/position/love.jpg"))
    #     wordcloud = WordCloud(
    #         # 添加遮罩层
    #         mask=mask,
    #         # 生成中文字的字体,必须要加,不然看不到中文
    #         # font_path="C:\Windows\Fonts\STXINGKA.TTF"
    #     ).generate(text)
    #     image_produce = wordcloud.to_image()
    #     # image_produce.show()
    #     rand = str(time.strftime("%Y-%m-%d-%H%M%S", time.localtime(time.time())))
    #     filename = media_path + "/" + rand + ".png"
    #     image_produce.save(filename)
    #     image_data = open(filename, "rb").read()
    #     return HttpResponse(image_data, content_type="image/png")
    pass


# 分词
def trans_CN(text):
    # # 接收分词的字符串
    # word_list = jieba.cut(text)
    # # 分词后在单独个体之间加上空格
    # result = " ".join(word_list)
    # return result
    pass


# 统计图 char city
def charCity(request):
    if request.method == "POST":
        qResult = Position.objects.values("city", "city_count").distinct().order_by('-city_count')[0:12]  # 从大到小排序
        cityList = list(qResult)   # 直接把QuerySet转为List
        # print(cityList)
        return HttpResponse(json.dumps({'data': cityList}), content_type="application/json")


# 统计图  char 学历
# select xueli,count(*) from position_position group by xueli;
def charXueli(request):
    if request.method == "POST":
        cursor = connection.cursor()
        cursor.execute("select xueli,count(*) as x_count from position_position group by xueli")
        x_dict = dict(list(cursor.fetchall()))
        print(x_dict)

        # print(qResult)
        return HttpResponse(json.dumps({'data': x_dict}), content_type="application/json")


# 统计图  char 工作经验
# select xueli,count(*) from position_position group by xueli;
def charWorkJy(request):
    if request.method == "POST":
        cursor = connection.cursor()
        cursor.execute("select gzjy, count(*) as j_count from position_position group by gzjy;")
        j_dict = dict(list(cursor.fetchall()))
        print(j_dict)

        # print(qResult)
        return HttpResponse(json.dumps({'data': j_dict}), content_type="application/json")

