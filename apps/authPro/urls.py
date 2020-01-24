from django.urls import path, re_path, include
from .views import LoginView, register_view, logout_view, graph_captcha, aboutme_view


app_name = 'authPro'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', register_view, name='register'),
    path('logout/', logout_view, name='logout'),
    path('graph-captcha/', graph_captcha, name='graph_captcha'),
    path('aboutme/', aboutme_view, name='aboutme'),
]