import json
import time
import requests
import jieba
from django.db.models import Q
from wordcloud import WordCloud
import PIL.Image as image
import numpy as np

from lagou_position.settings import MEDIA_ROOT  as media_path
from lagou_position.settings import STATICFILES_DIRS as static_path

from django.shortcuts import render,reverse,redirect
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.views.generic import View
from django.http import Http404
from django.views.decorators.http import require_GET, require_POST
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.core import serializers

from utils import mcache
from .models import Position
from .pa import PaPosition

from django.db import connection



# 首页
# @csrf_protect
# @login_required
def index(request):
    username = request.session.get('user_name', '')
    if not username:
        return redirect('/auth/login/')
    else:
        return render(request, 'position/index.html')


# @csrf_protect
# 获取点位置
def get_pos(request):
    if request.method == 'POST':
        positions = Position.objects.filter(user_id=request.session.get('user_id'))
        position_res = serializers.serialize('json', positions)  # 讲查询结果json序列化
        # print(position_res)
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json
    else:
        # return JsonResponse({'data': 'error!'})
        pass


# 首页 职位列表筛选 like
def search_key_view(request):
    if request.method == 'POST':
        parm = request.POST.get('params')
        positions = Position.objects.filter(user_id=request.session.get('user_id')).filter(Q(name__icontains=parm) | Q(size__icontains=parm) | Q(zwname__icontains=parm) | Q(xueli__icontains=parm) | Q(gzjy__icontains=parm) | Q(city__icontains=parm))
        position_res = serializers.serialize('json', positions)  # 讲查询结果json序列化
        # print(position_res)
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json
    else:
        # return JsonResponse({'data': 'error!'})
        pass


# 筛选地图点,联动
def select_points(request):
    if request.method == 'POST':
        parm = request.POST.get('params')
        type_name = request.POST.get('typeName')

        if type_name == "学历":
            positions = Position.objects.filter(xueli=parm, user_id=request.session.get('user_id'))
        elif type_name == "经验":
            positions = Position.objects.filter(gzjy=parm, user_id=request.session.get('user_id'))
        elif type_name == "城市":
            positions = Position.objects.filter(city=parm, user_id=request.session.get('user_id'))
        elif type_name == "领域":
            positions = Position.objects.filter(jyfanwei=parm, user_id=request.session.get('user_id'))
        elif type_name == "规模":
            positions = Position.objects.filter(size=parm, user_id=request.session.get('user_id'))

        position_res = serializers.serialize('json', positions)  # 讲查询结果json序列化
        print(position_res)
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json
    else:
        pass


# 分析页面职位列表的筛选
def get_data_list(request):
    if request.method == 'POST':
        parm = request.POST.get('parm')
        typeName = request.POST.get('typeName')

        if typeName == "学历":
            positions = Position.objects.filter(xueli=parm, user_id=request.session.get('user_id'))
        elif typeName == "经验":
            positions = Position.objects.filter(gzjy=parm, user_id=request.session.get('user_id'))
        elif typeName == "城市":
            positions = Position.objects.filter(city=parm, user_id=request.session.get('user_id'))
        elif typeName == "领域":
            positions = Position.objects.filter(jyfanwei=parm, user_id=request.session.get('user_id'))
        elif typeName == "规模":
            positions = Position.objects.filter(size=parm, user_id=request.session.get('user_id'))

        position_res = serializers.serialize('json', positions)  # 将查询结果json序列化
        return HttpResponse(position_res, content_type="application/json")   # 职位数据json


# 获取代理
def get_proxy():
    # 111.206.217.186:8082
    return requests.get("http://127.0.0.1:5010/get/").json().get("proxy")

def delete_proxy(proxy):
    requests.get("http://127.0.0.1:5010/delete/?proxy={}".format(proxy))


# 点击爬取职位信息
def search(request):
    if request.method == "POST":
        canshu = request.POST.get('zname')
        # run: pa function
        # ......
        try:

            # 先判断数据表原来有没有数据
            result = Position.objects.filter(user_id=request.session.get('user_id'))
            if result.exists():
                print("用户id：" + str(request.session.get('user_id')) + " : QuerySet has Data, 先清除原来数据,再进行导入...")  # 清空用户原来数据
                Position.objects.filter(user_id=request.session.get('user_id')).delete()

            url = " https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
            proxie = {"http": "http://{}".format(get_proxy())}
            pa = PaPosition(canshu, request.session['user_id'], proxies=proxie)
            # 用户输入的参数
            first_page = pa.get_json(url, 1, canshu)  # 先获取第一页数据
            total_page_count = first_page['content']['positionResult']['totalCount']  # 职位总数
            num = pa.get_page_num(total_page_count)  # 页码数
            total_info = []
            time.sleep(1)
            print("{0}相关职位总数:{1},总页数为:{2}".format(canshu, total_page_count, num))
            # 正式开始
            for num in range(1, num + 1):
                # 每一轮都更换代理
                pa.proxies = {"http": "http://{}".format(get_proxy())}
                print("代理： " + str( pa.proxies))
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
# 图表展示职位分析
# @login_required
def analyze(request):
    username = request.session.get('user_name', '')
    # 如果没有登录
    if not username:
        return redirect('/auth/login/')
    else:
        return render(request, 'position/analyze.html')


# 统计城市职位数量  （热力图用的）
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
            city_counts = Position.objects.filter(user_id=request.session.get('user_id')).values('city')
            for i in city_counts:
                if i['city'] in city_dict:
                    count = city_dict[i['city']]
                else:
                    count = 0
                count = count + 1
                city_dict[i['city']] = count
                # print(i.value())
            all_data = Position.objects.filter(user_id=request.session.get('user_id'))
            # print(all_data)
            for j in all_data:
                # print(j.city)
                if j.city in city_dict.keys():  # 判断sql查出来的city, 是否在字典的key中
                    # 查出数据,update他的count的值为对应字典键值对的value
                    # 如果在，就更新数据
                    Position.objects.filter(id=j.id, user_id=request.session.get('user_id')).update(city_count=city_dict[j.city])
            # print(city_dict)
            # print("更新count_city完成!")
        except Exception as e:

            return JsonResponse(failData)
        else:
            return JsonResponse(successData)


# 测试
def other(request):
    # print(type(request.session['user_id']))
    return render(request, 'position/other.html')


# 统计图 char city
def charCity(request):
    if request.method == "POST":
        qResult = Position.objects.filter(user_id=request.session.get('user_id')).values("city", "city_count").distinct().order_by('-city_count')  # 去重,并且从大到小排序
        cityList = list(qResult)   # 直接把QuerySet转为List
        # print(len(cityList))
        return HttpResponse(json.dumps({'data': cityList}), content_type="application/json")


# 统计图  char 学历
# select xueli,count(*) from position_position group by xueli;
def charXueli(request):
    if request.method == "POST":
        cursor = connection.cursor()
        sql = "select xueli,count(*) as x_count from position_position where user_id="+str(request.session.get('user_id')) + " group by xueli"
        cursor.execute(sql)
        x_dict = dict(list(cursor.fetchall()))
        # print(x_dict)
        # print(qResult)
        return HttpResponse(json.dumps({'data': x_dict}), content_type="application/json")


# 统计图  char 工作经验
# select xueli,count(*) from position_position group by xueli;
def charWorkJy(request):
    if request.method == "POST":
        cursor = connection.cursor()
        sql = "select gzjy, count(*) as j_count from position_position where user_id="+str(request.session.get('user_id')) + " group by gzjy;"
        # print(sql)
        cursor.execute(sql)
        j_dict = dict(list(cursor.fetchall()))
        # print(j_dict)

        # print(qResult)
        return HttpResponse(json.dumps({'data': j_dict}), content_type="application/json")

# 统计图 pie  行业领域
def charWorkIndustry(request):
    if request.method == "POST":
        cursor = connection.cursor()
        sql = "select jyfanwei, count(*) as j_count from position_position where user_id="+str(request.session.get('user_id')) + " group by jyfanwei;"
        # print(sql)
        cursor.execute(sql)
        j_dict = dict(list(cursor.fetchall()))
        # print(j_dict)

        # print(qResult)
        return HttpResponse(json.dumps({'data': j_dict}), content_type="application/json")


# 统计图 pie  行业领域
def charWorkSize(request):
    if request.method == "POST":
        cursor = connection.cursor()
        sql = "select size, count(*) as j_count from position_position where user_id="+str(request.session.get('user_id')) + " group by size;"
        # print(sql)
        cursor.execute(sql)
        j_dict = dict(list(cursor.fetchall()))
        # print(j_dict)
        return HttpResponse(json.dumps({'data': j_dict}), content_type="application/json")


# 词云
def get_word_view(request):
    if request.method == "POST":
        fuli_dict = {}    # {'扁平管理': 21, '弹性工作': 22, '大厨定制三餐': 9, '就近租房补贴': 9}
        try:
            fuli_counts_fromsql = Position.objects.filter(user_id=request.session.get('user_id')).values()
            for i in fuli_counts_fromsql:
                if i['gsfl'] is None:
                    continue
                split_fuli = (i['gsfl']).split(',')
                if len(split_fuli) == 1 or len(split_fuli) == 0:
                    continue
                for single in split_fuli:
                    if single in fuli_dict:
                        count = fuli_dict[single]
                    else:
                        count = 0
                    count = count + 1
                    fuli_dict[single] = count
                # print(i.value())
            # print(fuli_dict)
            # print("获取 公司福利完成!")
        except Exception as e:
            return HttpResponse("fail")
        else:
            return HttpResponse(json.dumps({'data': fuli_dict}), content_type="application/json")



