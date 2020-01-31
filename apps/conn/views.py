from django.db.models import Q
from django.shortcuts import render, redirect
from django.views import View
from apps.authPro.models import User
from apps.conn.forms import NewsPubForm
from apps.conn.models import News, NewsComment
from apps.conn.serializers import NewsSerializer, NewsCommentSerializer
from lagou_position import settings
from utils import restful


# 求职交流  首页列表
def connect_dis_view(request):
    username = request.session.get('user_name', '')
    if not username:
        return redirect('/auth/login/')
    else:
        # global newses
        # select_related 一般都是用在外键，优化查询sql语句   内连接
        # orm会吧sql对象转成python，加上defer 忽略掉
        newses = News.objects.defer('content').select_related('author').all()[0:settings.ONE_PAGE_NEWS_COUNT]
        context = {
            "newses": newses,
        }
        print(context.get(newses))
        # return render(request, 'connect/connect.html', context=context)
        return render(request, 'connect/connect.html', context=context)



# 我的文章
def my_pub_view(request):
    userid = request.session.get('user_id', '')
    if not userid:
        return redirect('/auth/login/')
    else:
        # global newses
        # select_related 一般都是用在外键，优化查询sql语句   内连接
        # orm会吧sql对象转成python，加上defer 忽略掉
        # 搜索
        newses = News.objects.defer('content').select_related('author').filter(author_id=userid)[0:settings.ONE_PAGE_NEWS_COUNT]
        context = {
            "newses": newses,
        }
        print(context.get(newses))
        # return render(request, 'connect/connect.html', context=context)
        return render(request, 'connect/my_pub.html', context=context)


# 搜索
def search_view(request):
    username = request.session.get('user_name', '')
    if not username:
        return redirect('/auth/login/')
    else:
        q = request.GET.get('q',None)
        if q:
            newses = News.objects.filter(Q(title__contains=q) | Q(content__icontains=q) | Q(author__username__icontains=q))
        else:
            newses = News.objects.defer('content').select_related('author').all()[0:settings.ONE_PAGE_NEWS_COUNT]
        context = {
            "newses": newses,
            "s_key":q,
        }
        return render(request, 'connect/search.html', context=context)


# 展示列表
def news_list(request):
    username = request.session.get('user_name', '')
    parm = request.POST.get('parm')
    if not username:
        return redirect('/auth/login/')
    else:

        page = int(request.POST.get('page', 1))  # str  - 1     初始值为2
        # limit  从第几条数据开始 要取几条 # 一页只有1条
        # 0-1  1-2
        # 开始位置 结束位置 0 + (0+1) page+1 page=2  1 - (1+1=2 ) 2 - 3
        # page_start = settings.ONE_PAGE_NEWS_COUNT * (page - 1)
        # page_end = page_start + settings.ONE_PAGE_NEWS_COUNT
        # 如果是全部显示
        if parm == 'all':
            page_start = settings.ONE_PAGE_NEWS_COUNT * (page - 1)
            page_end = page_start + settings.ONE_PAGE_NEWS_COUNT
            newses = News.objects.all()[page_start:page_end]
        # 只显示我的文章
        elif parm == 'me':
            page_start = settings.ONE_PAGE_NEWS_COUNT * (page - 1)
            page_end = page_start + settings.ONE_PAGE_NEWS_COUNT
            newses = News.objects.filter(author_id=request.session.get('user_id'))[page_start:page_end]
        # 在搜索结果中显示
        else:
            page_start = settings.ONE_PAGE_NEWS_COUNT * (page - 1)
            page_end = page_start + settings.ONE_PAGE_NEWS_COUNT
            newses = newses = News.objects.filter(Q(title__contains=parm) | Q(content__icontains=parm) | Q(author__username__icontains=parm))[page_start:page_end]

        # 要同时序列化多条
        serializer = NewsSerializer(newses, many=True)
        return restful.result(data={"newses": serializer.data})


# 新建&编辑文章
def connect_edit_view(request):
    username = request.session.get('user_name', '')
    if not username:
        return redirect('/auth/login/')
    else:
        return render(request, 'connect/edit.html')


# 文章详情
def connect_detail_view(request, news_id):
    # 获取文章
    try:
        news = News.objects.select_related('author').get(id=news_id)
        return render(request, 'connect/news_detail.html', context={"news": news, 'session_user_id':request.session.get('user_id')})
    # 自动寻找
    except News.DoesNotExist:
        return render(request, '404.html')

# 删除自己的文章
def del_my_news(request):
    new_id = request.POST.get("id")
    my_news = News.objects.filter(id=new_id)
    if my_news:
        # 真删
        my_news.delete()
        return restful.ok()
    return restful.params_error(message="该文章不存在")


# 发布新动态文章
class NewsPub(View):
    def get(self, request):
        pass

    def post(self, request):
        form = NewsPubForm(request.POST)
        if form.is_valid():
            # 如果验证成功，取出Ajax数据
            title = form.cleaned_data.get('title')
            content = form.cleaned_data.get('content')
            # 通过id来取值
            user =  User.objects.get(id=request.session.get('user_id'))
            # 存入数据库
            News.objects.create(title=title, content=content, author=user)
            return restful.ok()
        # 这个错误是出现在success里面的， 不会出现在error里面
        return restful.params_error(message=form.get_error())


# 文章评论
def add_comment(request):
    news_id = request.POST.get('news_id')
    content = request.POST.get('content')
    # 加first() 不然是QuerySet对象
    news = News.objects.filter(id=news_id).first()
    # 如果新闻存在
    if news:
        if content:
            # 如果有新闻有评论， 将发表的评论添加入数据库
            user = User.objects.get(id=request.session.get('user_id'))
            comment = NewsComment.objects.create(content=content, news=news, author=user)
            # 一次只返回一条
            serializer = NewsCommentSerializer(comment)
            # 将模型序列化之后传到前台
            return restful.result(data={"comment": serializer.data})
        return restful.params_error(message="评论不能为空")
    return restful.params_error(message="文章不存在")


# 只接受评论的返回数据
def comment_with_news(request):
    news_id = int(request.POST.get("news_id"))
    if news_id:
        news = News.objects.filter(id=news_id).first()
        # 获取当前新闻下的所有评论    反向查找
        comments = news.comment.all()
        serializer = NewsCommentSerializer(comments, many=True)
        return restful.result(data={"comments": serializer.data})











