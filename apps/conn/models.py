from django.db import models

# Create your models here.
class News(models.Model):
    title = models.CharField(max_length=50, null=False)
    content = models.TextField()
    # 发布时间
    pub_time = models.DateTimeField(auto_now_add=True)
    is_delete = models.BooleanField(default=True)
    # 外键   on_delete=models.SET_NULL 如果删除标签或者作者,就将这个外键字段设置为NULL
    author = models.ForeignKey("authPro.User", on_delete=models.SET_NULL, null=True)

    class Meta:
        ordering = ['-pub_time']


# 文章评论
class NewsComment(models.Model):
    content = models.TextField()
    pub_time = models.DateTimeField(auto_now_add=True)
    # 外键
    news = models.ForeignKey("News", on_delete=models.CASCADE, related_name = "comment")
    author = models.ForeignKey("authPro.User", on_delete=models.CASCADE)

    class Meta:
        ordering = ['-pub_time']
