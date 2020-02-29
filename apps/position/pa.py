#!/usr/bin/python3

import math
import time
import requests
import pandas as pd
from lxml import etree
import pymysql
from urllib.request import quote

from .models import Position


db_config = {
    'host': '127.0.0.1',
    'port': 3306,
    'user': 'xps',
    'password': '123456',
    'db': 'position',
    'charset': 'utf8'
}


class PaPosition(object):

    def __init__(self, cname, user_id, proxies):
        self.name = cname
        self.user_id = user_id
        self.proxies = proxies

    def get_json(self, url, num, name):
        qname = quote(name)  # 转码
        url1 = "https://www.lagou.com/jobs/list_"+qname+"?labelWords=&fromSearch=true&suginput="
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36',
            'Host': 'www.lagou.com',
            'Referer': 'https://www.lagou.com/jobs/list_%E6%95%99%E5%B8%88/p-city_0?&cl=false&fromSearch=true&labelWords=&suginput=',
            'X-Anit-Forge-Code': '0',
            'X-Anit-Forge-Token': 'None',
            'X-Requested-With': 'XMLHttpRequest'
        }
        data = {
            'first': 'true',
            'pn': num,
            'kd': name,
        }

        s = requests.Session()
        print('建立session：', s, '\n\n')
        s.get(url=url1, headers=headers, timeout=3)
        cookie = s.cookies
        print('获取cookie：', cookie, '\n\n')
        # 前面都是铺垫
        res = requests.post(url, headers=headers, data=data, cookies=cookie, timeout=3, proxies=self.proxies)
        # res.raise_for_status()
        if res.status_code == '404':
            print(res.status_code)
        res.encoding = 'utf-8'
        page_data = res.json()
        print('请求响应结果：', page_data, '\n\n')
        return page_data

    def get_page_num(self, count):
        """
        计算要抓取的页数，通过在拉勾网输入关键字信息，可以发现最多显示30页信息,每页最多显示15个职位信息
        :return:
        """
        page_num = math.ceil(count / 15)  # 一页显示15个职位
        if page_num > 30:
            return 30
        else:
            return page_num

    def get_page_info(self, jobs_list):
        """
        获取职位
        :param jobs_list:
        :return:
        """
        page_info_list = []
        for i in jobs_list:  # 循环每一页所有职位信息
            job_info = []
            job_info.append(i['companyFullName'])             # 公司全名
            job_info.append(i['companyShortName'])            # 公司简称
            job_info.append(i['companySize'])                 # 公司规模
            job_info.append(i['financeStage'])                # 融资规模
            job_info.append(i['district'])                    # 城市的街区
            job_info.append(i['positionName'])                # 职位名称
            job_info.append(i['workYear'])                    # 工作经验
            job_info.append(i['education'])                   # 学历
            job_info.append(i['salary'])                      # 薪资（月薪）
            job_info.append(i['positionAdvantage'])           # 职位诱惑      "年底多薪 技术大牛 学术氛围好 成长迅速"
            job_info.append(i['industryField'])               # 领域
            job_info.append(i['firstType'])                   # "开发|测试|运维类"
            job_info.append(i['companyLabelList'])            # 公司标签 ["弹性工作", "领导好", "扁平管理", "五险一金"]
            job_info.append(i['secondType'])                  # "人工智能"
            job_info.append(i['city'])                        # 城市
            job_info.append(i['latitude'])                    # 纬度
            job_info.append(i['longitude'])                   # 经度
            job_info.append("https://www.lagou.com/jobs/" + str(i['positionId']) + ".html")    # 职位详情链接

            page_info_list.append(job_info)
        self.save_mysql(page_info_list)
        return page_info_list

    def save_mysql(self, all_data):
        # 插入
        global conn
        try:
            conn = pymysql.connect(**db_config)
            cursor = conn.cursor()

            j = 0
            # 写入数据
            for i in all_data:
                # 对公司福利进行处理   companyLabelList
                company_fuli = ','.join(str(s) for s in i[12])
                # insert into student values(id,name,age)
                sql = """insert into position_position values(%d,'%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s','%s', '%s','%s', '%s')""" % (
                j, i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8], i[9], i[10], i[11], company_fuli, i[13], i[14], i[15], i[16], i[17], self.user_id, 0)  # j是id吗
                print(sql)
                cursor.execute(sql)

            conn.commit()  # 数据有变动一定记得提交/双保险
            cursor.close()  # 一个游标只能执行一个SQL
            j += 1

        except Exception as e:
            print('数据入库 error start')
            print(e)
            print('数据入库 error end ')
            conn.rollback()

        finally:
            conn.commit()  # 数据有变动一定记得提交/双保险
            # cursor.close()
            conn.close()












# if __name__ == '__main__':
#     main()


