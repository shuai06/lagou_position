from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
# 重写auth系统


class UserManager(BaseUserManager):
    """
    用来创建用户：
        超级管理员
        普通用户
        用户是通过手机号注册的
    """
    def _create_user(self, telephone, username, password):
        # self.model => User
        user = self.model(telephone=telephone, username=username)
        # 密码加密
        user.set_password(password)
        user.save()
        return user

    # 通过这个方法来调用隐式方法, 不暴露接口,更加安全
    def create_user(self, telephone, username, password):
        return self._create_user(telephone=telephone, username=username, password=password)



# python manage.py createsuperuser ==> 调用自己重写的方法
# 自己定义  重写自带的User
class User(AbstractBaseUser):
    telephone = models.CharField(max_length=11, unique=True)
    username = models.CharField(max_length=30)
    email = models.EmailField(unique=True, null=True)
    join_date = models.DateTimeField(auto_now_add=True)
    # 0 保密  1 女  2 男
    gender = models.IntegerField(default=0)
    # 默认user = authenticate(username=username,password=password)
    # 以后使用 user = authenticate(username=telephone,password=password) 手机号登录
    USERNAME_FIELD = 'telephone'
    # 以后发送邮件的时候会使用 email
    EMAIL_FIELD = 'email'
    # 默认当我们在 python manage.py createsuperuser => email password
    #  python manage.py createsuperuser | email password =》1.USERNAME_FIELD=telephone 2.REQUIRED_FIELDS=username 3.password
    REQUIRED_FIELDS = ['username']

    # 为了以后可以通过 User.objects.all() 能使用 ,我们就要设置 objects,
    objects = UserManager()




























