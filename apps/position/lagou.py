#!/usr/bin/python3

import math
import time
import requests
import pandas as pd
from lxml import etree
import pymysql


db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'xps',
    'password': '123456',
    'db': 'position',
    'charset': 'utf8'
}




def get_json(url, num):
    url1 = "https://www.lagou.com/jobs/list_%E6%B8%97%E9%80%8F%E6%B5%8B%E8%AF%95?labelWords=&fromSearch=true&suginput="
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
        'Host': 'www.lagou.com',
        'Referer': 'https://www.lagou.com/jobs/list_%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90?labelWords=&fromSearch=true&suginput=',
        'X-Anit-Forge-Code': '0',
        'X-Anit-Forge-Token': 'None',
        'X-Requested-With': 'XMLHttpRequest'
    }
    data = {
        'first': 'true',
        'pn': num,
        'kd': '渗透测试'
    }
    s = requests.Session()
    print('建立session：', s, '\n\n')
    s.get(url=url1, headers=headers, timeout=3)
    cookie = s.cookies
    print('获取cookie：', cookie, '\n\n')
    # 前面都是铺垫
    res = requests.post(url, headers=headers, data=data, cookies=cookie, timeout=3)
    res.raise_for_status()
    res.encoding = 'utf-8'
    page_data = res.json()
    print('请求响应结果：', page_data, '\n\n')
    return page_data

def get_page_num(count):
    """
    计算要抓取的页数，通过在拉勾网输入关键字信息，可以发现最多显示30页信息,每页最多显示15个职位信息
    :return:
    """
    page_num = math.ceil(count / 15)  # 一页显示15个职位
    if page_num > 30:
        return 30
    else:
        return page_num

def get_page_info(jobs_list):
    """
    获取职位
    :param jobs_list:
    :return:
    """
    page_info_list = []
    for i in jobs_list:  # 循环每一页所有职位信息
        job_info = []
        job_info.append(i['companyFullName'])
        job_info.append(i['companyShortName'])
        job_info.append(i['companySize'])
        job_info.append(i['financeStage'])
        job_info.append(i['district'])
        job_info.append(i['positionName'])
        job_info.append(i['workYear'])
        job_info.append(i['education'])
        job_info.append(i['salary'])
        job_info.append(i['positionAdvantage'])
        job_info.append(i['industryField'])
        job_info.append(i['firstType'])
        job_info.append(i['companyLabelList'])
        job_info.append(i['secondType'])
        job_info.append(i['city'])
        job_info.append(i['latitude'])  # 纬度
        job_info.append(i['longitude'])  # 经度
        page_info_list.append(job_info)
    save_mysql(page_info_list)
    return page_info_list


def save_mysql(all_data):
    # 插入
    global conn
    try:
        conn = pymysql.connect(**db_config)
        cursor = conn.cursor()

        j = 0
        for i in all_data:

            ln12 = ''.join(str(s) for s in i[12])
            # insert into student values(id,name,age)
            sql = """insert into position_position values(%d,'%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s')"""%(j, i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9],i[10],i[11],ln12,i[13],i[14],i[15],i[16])
            print(sql)
            cursor.execute(sql)

        conn.commit()  # 数据有变动一定记得提交/双保险
        cursor.close()  # 一个游标只能执行一个SQL
        j += 1

    except Exception as e:
        print('error')
        print(e)
        conn.rollback()

    finally:
        conn.commit()  # 数据有变动一定记得提交/双保险
        # cursor.close()
        conn.close()


def main():
    url = " https://www.lagou.com/jobs/positionAjax.json?needAddtionalResult=false"
    first_page = get_json(url, 1)  # 先获取第一页数据
    total_page_count = first_page['content']['positionResult']['totalCount']  # 职位总数
    num = get_page_num(total_page_count)  # 页码数
    total_info = []
    time.sleep(5)
    print("GIS研发相关职位总数:{},总页数为:{}".format(total_page_count, num))

    for num in range(1, num + 1):
        # 获取【每一页】的职位相关的信息
        page_data = get_json(url, num)  # 获取响应json
        jobs_list = page_data['content']['positionResult']['result']  # 获取每页的所有gis相关的职位信息
        page_info = get_page_info(jobs_list)
        print("每一页python相关的职位信息:%s" % page_info, '\n\n')
        total_info += page_info
        print('已经爬取到第{}页，职位总数为{}'.format(num, len(total_info)))
        time.sleep(10)

        # 将总数据转化为data frame再输出,然后在写入到csv各式的文件中
        # df = pd.DataFrame(data=total_info, columns=['公司全名', '公司简称', '公司规模', '融资阶段', '区域', '职位名称', '工作经验', '学历要求', '薪资', '职位福利', '经营范围','职位类型', '公司福利', '第二职位类型', '城市', '纬度', '经度')
        # df.to_csv('GIS_development_engineer.csv', index=False)
        # print('gis开发相关职位信息已保存!!!!!!')
        # save to DB
        # save_mysql(total_info)

        print("OKOKOKOKOKOK!!!!!!!!!!!!!!!!!!!!!!!!!!!!")


# if __name__ == '__main__':
#     main()


