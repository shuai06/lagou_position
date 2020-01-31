from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        # 两错误  models   字段 join_time
        model = User
        fields = ('id', 'username', 'join_date')


