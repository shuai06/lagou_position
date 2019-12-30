from django.urls import path, re_path, include
from .views import LoginView, RegisterView, logout_view


app_name = 'authPro'

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', logout_view, name='logout'),
]