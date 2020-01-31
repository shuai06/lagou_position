from django import forms
from apps.conn.models import News
from apps.forms import FormMixin


class NewsPubForm(forms.ModelForm, FormMixin):
    # u_id = forms.IntegerField()

    class Meta:
        model = News
        fields = ['title', 'content']
        error_message = {
            "title": {
                "required": "标题不能为空",
            },
            "content": {
                "required": "新闻内容不能为空",
            },
        }
