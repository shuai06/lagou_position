from django.utils.timezone import now
from datetime import datetime
from django import template


# 生成一个注册器
register = template.Library()


@register.filter
def date_format(val):
    """
      当前时间小于1分钟  显示 "刚刚"
      当前时间小于1小时  显示 "xx分钟前"
      当前时间小于24小时 显示 "xx小时前"
      当前时间小于30天   显示 "xx天前"
      则显示为具体时间   年/月/日 时间
      :param val: 时间
      :return:
    """
    if not isinstance(val, datetime):
        return val

    # 获取当前时间   now()具有国际意义，带时区
    time_now = now()

    # 获取新闻发布的时间
    # 当前的时间 - 新闻发布的时间 2< a  and a>4
    seconds = (time_now - val).total_seconds()
    if seconds < 60:
        return "刚刚"
    elif 60 <= seconds < 60 * 60:
        minute = int(seconds / 60)
        return '{}分钟前'.format(minute)
    elif 60 * 60 <= seconds < 60 * 60 * 24:
        hour = int(seconds / 60 / 60)
        return '{}小时前'.format(hour)
    elif 60 * 60 * 24 <= seconds < 60 * 60 * 24 * 30:
        day = int(seconds / 60 / 60 / 24)
        return '{}天前'.format(day)
    else:
        return val.strftime('%Y/%m/%d %H:%M')












