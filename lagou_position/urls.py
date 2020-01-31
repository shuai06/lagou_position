"""lagou_position URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static

# 要放在/ 路由  要么你就在把URL 定义成 /admin/media/

urlpatterns = [
    path('', include('apps.position.urls')),
    # path('position/', include('apps.position.urls')),
    path('auth/', include('apps.authPro.urls')),
    path('conn/', include('apps.conn.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
