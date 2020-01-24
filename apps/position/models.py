from django.db import models

# ['公司全名', '公司简称', '公司规模', '融资阶段', '区域', '职位名称', '工作经验',
# '学历要求', '薪资', '职位福利', '经营范围','职位类型', '公司福利', '第二职位类型', '城市', '纬度', '经度')


class Position(models.Model):

    fullname = models.CharField(max_length=50)         # 公司全名
    name = models.CharField(max_length=20)              # 公司简称
    size = models.CharField(max_length=20)              # 公司规模
    rzjd = models.CharField(max_length=20)              # 融资规模
    area = models.CharField(max_length=30)              # 城市的街区
    zwname = models.CharField(max_length=30)           # 职位名称
    gzjy = models.CharField(max_length=20)              # 工作经验
    xueli = models.CharField(max_length=30)             # 学历
    money = models.CharField(max_length=30)             # 薪资（月薪）
    zwfl = models.CharField(max_length=50)             # 职位诱惑      "年底多薪 技术大牛 学术氛围好 成长迅速"
    jyfanwei = models.CharField(max_length=30)         # 领域/ 经营范围
    zwtype = models.CharField(max_length=50)           # "开发|测试|运维类"
    gsfl = models.CharField(max_length=50)             # ["弹性工作", "领导好", "扁平管理", "五险一金"]
    drzwjy = models.CharField(max_length=20)            # "人工智能" / 后端开发
    city = models.CharField(max_length=20)              # 城市
    lat = models.CharField(max_length=20)               # 纬度
    lon = models.CharField(max_length=20)              # 经度
    detail_link = models.CharField(max_length=50)      # 职位详情链接
    user = models.CharField(max_length=50, null=True)  # 所属的用户
    city_count = models.IntegerField(null=True)         # 城市数量

    def __str__(self):
        return str(("{},{},{},{},{},{}".format(self.name, self.money, self.zwtype, self.city, self.lat, self.lon)))
