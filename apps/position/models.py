from django.db import models

# ['公司全名', '公司简称', '公司规模', '融资阶段', '区域', '职位名称', '工作经验',
# '学历要求', '薪资', '职位福利', '经营范围','职位类型', '公司福利', '第二职位类型', '城市', '纬度', '经度')


class Position(models.Model):

    name = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    rzjd = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    zwname = models.CharField(max_length=100)
    gzjy = models.CharField(max_length=100)
    xueli = models.CharField(max_length=100)
    money = models.CharField(max_length=100)
    zwfl = models.CharField(max_length=100)
    jyfanwei = models.CharField(max_length=100)
    zwtype = models.CharField(max_length=100)
    gsfl = models.CharField(max_length=100)
    drzwjy = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    lat = models.CharField(max_length=100)
    lon = models.CharField(max_length=100)
    city_count = models.CharField(max_length=100, null=True)   # 城市数量

    def __str__(self):
        return str(("{},{},{},{},{},{}".format(self.name, self.money, self.zwtype, self.city, self.lat, self.lon)))


