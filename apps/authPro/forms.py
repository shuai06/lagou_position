from django import forms
from django.core import validators
from apps.forms import FormMixin
from utils import mcache
from .models import User


# 自定义验证器
# 多继承
class LoginForm(forms.Form, FormMixin):
    # 自定义验证器  1[3-9][0-9]\d{8}
    telephone = forms.CharField(validators=[validators.RegexValidator(r'1[3-9][0-9]\d{8}', message='手机格式有误')], error_messages={"required": "手机号码不能为空"})
    password = forms.CharField(min_length=6, max_length=20, error_messages={"required": "密码框不能为空", "min_length": "密码长度不能低于6位", "max_length": "密码长度不能大于20位"})
    # 记住我 如果前端勾选 =》True   这里选择 False  选True表示一定要勾上
    remember = forms.BooleanField(required=False)
    # url = forms.CharField(validators=[validators.RegexValidator(),validators.URLValidator])
    # url = forms.URLField()    #这俩是一个东西


class RegisterForm(forms.Form, FormMixin):
    telephone = forms.CharField(validators=[validators.RegexValidator(r'1[3-9][0-9]\d{8}', message='手机格式有误')],
                                error_messages={"required": "手机号码不能为空"})
    password = forms.CharField(min_length=6, max_length=20,
                               error_messages={"required": "密码框不能为空", "min_length": "密码长度不能低于6位",
                                               "max_length": "密码长度不能大20位"})
    username = forms.CharField(max_length=20, min_length=1,
                               error_messages={"required": "用户名不能为空"})

    password_repeat = forms.CharField(min_length=6, max_length=20,
                               error_messages={"required": "密码框不能为空", "min_length": "密码长度不能低于6位",
                                               "max_length": "密码长度不能大于20位"})
    graph_captcha = forms.CharField(max_length=4, min_length=4,
                                    error_messages={"required": "图形验证码不能为空"})

    # 自定义验证   self => form  不通过验证码通过不用保存数据
    def valid_data(self, request):
        # 验证 图形验证码 / 确认密码
        password = self.cleaned_data.get('password')
        password_repeat = self.cleaned_data.get('password_repeat')
        if password != password_repeat:
            return self.add_error("sms_captcha", "两次密码不一致")

        # 图形验证码
        graph_captcha = self.cleaned_data.get('graph_captcha')
        server_graph_captcha = mcache.get_key('graph_captcha')

        if not server_graph_captcha:
            return self.add_error("graph_captcha", "图形验证码已过期")

        if graph_captcha.lower() != server_graph_captcha.lower():
            return self.add_error("graph_captcha", "图形验证码不正确")

        # 用户是否存在
        telephone = self.cleaned_data.get('telephone')
        user = User.objects.filter(telephone=telephone).exists()
        # 如果用户已经存在
        if user:
            return self.add_error("telephone", "该用户已经注册过了")
        # 全部验证通过才会返回True  self => form
        return True

































