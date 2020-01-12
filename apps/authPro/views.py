from django.contrib.auth.hashers import check_password
from django.shortcuts import render, redirect, reverse
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout

from apps.authPro.forms import LoginForm, RegisterForm
from utils import restful, mcache
from utils.captcha.captcha import Captcha
from io import BytesIO
from .models import User


# 类视图
# 登录
class LoginView(View):
    # 相当于 if request.method == 'GET'
    def get(self, request):
        return render(request, 'authPro/login.html')

    # 相当于 if request.method == 'POST'
    def post(self, request):
        # form 实例化  =》 self === form
        form = LoginForm(request.POST)
        if form.is_valid():
            telephone = form.cleaned_data['telephone']
            password = form.cleaned_data['password']
            remember = form.cleaned_data['remember']
            # user = authenticate(username=telephone, password=password)  # 此种方法有bug
            user = User.objects.get(telephone=telephone)
            pwd = user.password
            if check_password(password, pwd):
                next_url = request.GET.get("next")
                if next_url:
                    return redirect(next_url)
                login(request, user)
                if remember:
                    # None表示14天 单位是秒
                    request.session.set_expiry(None)
                return restful.ok()

            return restful.params_error(message='用户名或密码错误')

        return restful.params_error(message=form.get_error())


# 退出登录
def logout_view(request):
    logout(request)
    return redirect('/auth/login/')


# 注册
class RegisterView(View):
    # 相当于 if request.method == 'GET'
    def get(self, request):
        return render(request, 'authPro/register.html')

    # 相当于 if request.method == 'POST'
    def post(self, request):
        form = RegisterForm(request.POST)
        # True and True
        if form.is_valid() and form.valid_data(request):
            telephone = form.cleaned_data['telephone']
            password = form.cleaned_data['password']
            username = form.cleaned_data['username']
            # User 自定义   创建用户
            user = User.objects.create_user(telephone=telephone, username=username, password=password)
            # 注册完之后 login
            login(request, user)
            # {code:0,message:'',data:null}
            return restful.ok()
        return restful.params_error(message=form.get_error())


# 图形验证码
def graph_captcha(request):
    captcha, image = Captcha.gene_code()
    # image 是一个函数对象  要变成一个数据流才能被 HttpResponse 识别
    # BytesIO 用于存放字节流
    # 实例化
    out = BytesIO()
    # 保存图片
    image.save(out, 'png')
    # 设置回到文件最开头
    out.seek(0)
    # 设置类型
    response = HttpResponse(content_type="image/png")
    # 去读文件 并写入response
    response.write(out.read())
    mcache.set_key('graph_captcha', captcha)

    return response




