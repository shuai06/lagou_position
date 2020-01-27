from django.urls import path,re_path, include
from .views import get_pos, index, search, analyze, count_city, other, charCity, charXueli, charWorkJy, get_xueli, connect_view, get_word_view

# 防止不同app中的URL的name产生冲突   reverse(appName:hello)
app_name = 'position'

urlpatterns = [
    path('', index, name='index'),
    path('search/', search, name='search'),
    path('get_pos/', get_pos, name='get_pos'),
    path('analyze/', analyze, name='analyze'),
    path('count_city/', count_city, name='count_city'),
    path('other/', other, name='other'),
    path('charCity/', charCity, name='charCity'),
    path('charXueli/', charXueli, name='charXueli'),
    path('charWorkJy/', charWorkJy, name='charWorkJy'),
    path('get_xueli/', get_xueli, name='get_xueli'),
    path('connect/', connect_view, name='connect'),
    path('get_word_cloud/', get_word_view, name='get_word_cloud'),
]
