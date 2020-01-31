from rest_framework import  serializers
from .models import News, NewsComment
from apps.authPro.serializers import UserSerializer


# 把model直接序列化   就可以旨在在后台将查到的数据库的数据传到前台
class NewsSerializer(serializers.ModelSerializer):
    # tag是外键  先实例化一下
    author = UserSerializer()

    class Meta:
        model = News
        fields = ('id', 'title', 'pub_time','is_delete', 'content', 'author')


# 文章评论模型序列化
class NewsCommentSerializer(serializers.ModelSerializer):
    author = UserSerializer()

    class Meta:
        model = NewsComment
        fields = ('content', 'pub_time', 'author')
