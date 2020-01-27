from django.urls import path, re_path, include
from .views import LoginView, register_view, logout_view, graph_captcha, aboutme_view, updatepsd_view


app_name = 'authPro'

urlpatterns = [
    path('login/', LoginView, name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('graph-captcha/', graph_captcha, name='graph_captcha'),
    path('aboutme/', aboutme_view, name='aboutme'),
    path('updatepsd/', updatepsd_view, name='updatepsd'),
]