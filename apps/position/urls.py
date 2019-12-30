from django.urls import path,re_path, include
from .views import get_pos, index, search, analyze, count_city, other

# 防止不同app中的URL的name产生冲突   reverse(appName:hello)
app_name = 'position'

urlpatterns = [
    path('', index, name='index'),
    path('search/', search, name='search'),
    path('get_pos/', get_pos, name='get_pos'),
    path('analyze/', analyze, name='analyze'),
    path('count_city/', count_city, name='count_city'),
    path('other/', other, name='other'),
]
