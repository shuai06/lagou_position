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


class RegisterForm(forms.Form):

    username = forms.CharField(label="用户名", max_length=128, widget=forms.TextInput())
    email = forms.EmailField(label="邮箱", widget=forms.EmailInput())
    password = forms.CharField(label="密码", max_length=256, widget=forms.PasswordInput())
    password_repeat = forms.CharField(label="确认密码", max_length=256,
                                widget=forms.PasswordInput())
    # captcha = forms.CaptchaField(label='验证码')
    # graph_captcha = forms.CharField(max_length=4, min_length=4,error_messages={"required": "图形验证码不能为空"})

# class ProfileForm(forms.Form):
#     avatar = forms.ImageField(label="头像")



# # 自定义验证   self => form  不通过验证码通过不用保存数据
    # def valid_data(self, request):
    #     # 验证 图形验证码 / 确认密码
    #     password = self.cleaned_data.get('password')
    #     password_repeat = self.cleaned_data.get('password_repeat')
    #     if password != password_repeat:
    #         return self.add_error("captcha_error", "两次密码不一致")
    #
    #     # 图形验证码
    #     graph_captcha = self.cleaned_data.get('graph_captcha')
    #     server_graph_captcha = mcache.get_key('graph_captcha')
    #
    #     if not server_graph_captcha:
    #         return self.add_error("graph_captcha", "图形验证码已过期")
    #
    #     if graph_captcha.lower() != server_graph_captcha.lower():
    #         return self.add_error("graph_captcha", "图形验证码不正确")
    #
    #     # 用户是否存在
    #     username  = self.cleaned_data.get('username')
    #     user = User.objects.filter(username=username).exists()
    #     # 如果用户已经存在
    #     if user:
    #         return self.add_error("telephone", "该用户已经注册过了")
    #     # 全部验证通过才会返回True  self => form
    #     return True
    #
































