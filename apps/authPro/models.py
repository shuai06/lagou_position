from django.db import models


class User(models.Model):
    username = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=60, unique=True)
    join_date = models.DateTimeField(auto_now_add=True)
    # avatar = models.ImageField(default="avatar/default.jpeg", upload_to='avatar/')   # 头像

    def __str__(self):
        print(self.username)





























