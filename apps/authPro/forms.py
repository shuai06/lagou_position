from django import forms
from django.core import validators
from apps.forms import FormMixin
from utils import mcache
from .models import User


# 自定义验证器
# 多继承
class LoginForm(forms.Form):
    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput())
    password = forms.CharField(label="密码", max_length=256, widget=forms.PasswordInput())
    # widget = forms.PasswordInput用于指定该字段在form表单里表现为 < input type = 'password' / >，也就是密码输入框
    # graph_captcha = forms.CharField(max_length=4, min_length=4)

    # # 自定义验证   self => form  不通过验证码通过不用保存数据
    # def valid_data(self):
    #     # 验证: 图形验证码
    #     graph_captcha = self.cleaned_data.get('graph_captcha')
    #     server_graph_captcha = mcache.get_key('graph_captcha')
    #     print('graph_captcha')
    #     print(graph_captcha)
    #     print(server_graph_captcha)
    #     if not server_graph_captcha:
    #         # return self.add_error("graph_captcha", "图形验证码已过期")
    #         return False
    #
    #     if graph_captcha.lower() != server_graph_captcha.lower():
    #         # return self.add_error("graph_captcha", "图形验证码不正确")
    #         return False
    #     return True




class RegisterForm(forms.Form):

    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput())
    email = forms.EmailField(label="邮箱", widget=forms.EmailInput())
    password = forms.CharField(label="密码", max_length=256, widget=forms.PasswordInput())
    password_repeat = forms.CharField(label="确认密码", max_length=256,
                                widget=forms.PasswordInput())
    # captcha = forms.CaptchaField(label='验证码')



































