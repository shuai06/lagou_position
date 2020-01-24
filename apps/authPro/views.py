from django.contrib.auth.hashers import check_password
from django.shortcuts import render, redirect, reverse
from django.views import View
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout

from apps.authPro.forms import LoginForm, RegisterForm
from utils import restful, mcache
from utils.captcha.captcha import Captcha
import hashlib

from io import BytesIO
from .models import User
from django.db import connection

# 类视图
# 登录
def LoginView(request):
    if request.method == 'GET':
        return render(request, 'authPro/login.html')

    if request.method == 'POST':
        login_form = LoginForm(request.POST)
        message = "请检查填写的内容！"
        if login_form.is_valid():
            username = request.POST.get('username')
            password = request.POST.get('password')
            hash_psd = hash_code(password)
            # 其他验证
            try:
                # user = User.objects.get(username=username)
                sql = "select * from authPro_user where username='"+ username + "';"
                # user = User.objects.filter(username=str(username))
                cursor = connection.cursor()
                cursor.execute(sql)
                db_user_tuple = cursor.fetchone()
                if db_user_tuple[2] == hash_psd:
                    request.session['is_login'] = True
                    request.session['user_id'] = db_user_tuple[0]
                    request.session['user_name'] = db_user_tuple[1]
                    # request.session['user_avatar'] = user.avatar

                    next_url = request.GET.get("next", '')
                    if next_url:
                        return redirect(next_url)
                    else:
                        return redirect("/")
                else:
                    message = "密码不正确！"
            except Exception as e:
                message = "用户不存在！"
                print(e)
        return render(request, 'authPro/login.html', locals())


# 退出登录
def logout_view(request):
    if not request.session.get('is_login', None):
        # 如果本来就未登录，也就没有登出一说
        return redirect("/")
    request.session.flush()   # flush会一次性清空session中所有内容
    return redirect('/auth/login/')


# 注册   next_url的修改
def register_view(request):
    if request.method == "GET":
        return render(request, "authPro/register.html")

    # if request.session.get('is_login', None):
    #     # 登录状态不允许注册。你可以修改这条原则！
    #     return redirect("/")

    if request.method == "POST":
        register_form = RegisterForm(request.POST)
        message = "请检查填写的内容！"
        if register_form.is_valid():  # 获取数据
            username = register_form.cleaned_data['username']
            password = register_form.cleaned_data['password']
            password_repeat = register_form.cleaned_data['password_repeat']
            email = register_form.cleaned_data['email']
            if password != password_repeat:  # 判断两次密码是否相同
                message = "两次输入的密码不同！"
                return render(request, 'authPro/register.html', locals())
            else:
                same_name_user = User.objects.filter(username=username)
                if same_name_user:  # 用户名唯一
                    message = '用户已经存在，请重新选择用户名！'
                    return render(request, 'authPro/register.html', locals())
                same_email_user = User.objects.filter(email=email)
                if same_email_user:  # 邮箱地址唯一
                    message = '该邮箱地址已被注册，请使用别的邮箱！'
                    return render(request, 'authPro/register.html', locals())

                # 当一切都OK的情况下，创建新用户
                new_user = User()
                new_user.username = username
                new_user.password = hash_code(password)
                new_user.email = email
                new_user.save()
                return redirect('/auth/login/')  # 自动跳转到登录页面
    register_form = RegisterForm()
    return render(request, 'authPro/register.html', locals())



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


def hash_code(s, salt='mysite'):# 加点盐
    h = hashlib.sha256()
    s += salt
    h.update(s.encode())  # update方法只接收bytes类型
    return h.hexdigest()


# # 编辑头像
# def profile_edit(request, id):
#     if request.method == 'POST':
#         # 上传的文件保存在 request.FILES 中，通过参数传递给表单类
#         profile_form = ProfileForm(request.POST, request.FILES)
#         if profile_form.is_valid():
#


# 关于我
def aboutme_view(request):
    return render(request, "authPro/aboutme.html")
