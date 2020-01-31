from django.urls import path, re_path, include
from .views import connect_dis_view, connect_edit_view, connect_detail_view, NewsPub, news_list, del_my_news, add_comment, comment_with_news, search_view, my_pub_view

app_name = 'connApp'

urlpatterns = [
    path('dis/', connect_dis_view, name='display'),
    path('my-pub/', my_pub_view, name='my-pub'),
    path('edit/', connect_edit_view, name='edit'),
    path('detail/<int:news_id>/', connect_detail_view, name='detail'),
    path('news-pub/', NewsPub.as_view(), name='pub'),
    path('list/', news_list, name='news_list'),
    path('del_my_new/',del_my_news, name='del_my_new'),
    path('add_comment/',add_comment, name='add_comment'),
    path('comment/list/', comment_with_news, name='comment_list'),
    path('search/', search_view, name='search'),

]