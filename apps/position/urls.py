from django.urls import path, re_path, include
from .views import get_pos,select_points, index, search, analyze, count_city, other, charCity, charXueli, charWorkJy, charWorkIndustry, charWorkSize, get_data_list, connect_view, get_word_view

# 防止不同app中的URL的name产生冲突   reverse(appName:hello)
app_name = 'position'

urlpatterns = [
    path('', index, name='index'),
    path('search/', search, name='search'),
    path('get_pos/', get_pos, name='get_pos'),
    path('select_points/', select_points, name='select_points'),
    path('analyze/', analyze, name='analyze'),
    path('count_city/', count_city, name='count_city'),
    path('other/', other, name='other'),
    path('charCity/', charCity, name='charCity'),
    path('charXueli/', charXueli, name='charXueli'),
    path('charWorkJy/', charWorkJy, name='charWorkJy'),
    path('charWorkIndustry/', charWorkIndustry, name='charWorkIndustry'),
    path('charWorkSize/', charWorkSize, name='charWorkSize'),
    path('get_data_list/', get_data_list, name='get_data_list'),
    path('connect/', connect_view, name='connect'),
    path('get_word_cloud/', get_word_view, name='get_word_cloud'),
]
