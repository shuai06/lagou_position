$(()=>{

var E = window.wangEditor;
var editor = new E('#edit_div');
// 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
editor.customConfig.emotions = [
    {
        // tab 的标题
        title: '默认',
        // type -> 'emoji' / 'image'
        type: 'image',
        // content -> 数组
        content: [
            {
                alt: '[坏笑]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/50/pcmoren_huaixiao_org.png'
            },
            {
                alt: '[舔屏]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/40/pcmoren_tian_org.png'
            },
            {
                alt: '[可爱]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/09/2018new_keai_org.png'
            },
            {
                alt: '[挤眼]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/43/2018new_jiyan_org.png'
            },
            {
                alt: '[汗]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/28/2018new_han_org.png'
            },
            {
                alt: '[哼]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/7c/2018new_heng_org.png'
            },
            {
                alt: '[委屈]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/a5/2018new_weiqu_org.png'
            },
            {
                alt: '[害羞]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c1/2018new_haixiu_org.png'
            },
            {
                alt: '[加油]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9f/2018new_jiayou_org.png'
            },
            {
                alt: '[挖鼻]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/9a/2018new_wabi_thumb.png'
            },
            {
                alt: '[憧憬]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/c9/2018new_chongjing_org.png'
            },
            {
                alt: '[二哈]',
                src: 'http://img.t.sinajs.cn/t4/appstyle/expression/ext/normal/22/2018new_erha_org.png'
            },

        ]
    },

];
editor.create();



    /*==========  发布动态  =========*/
    // 获取元素
    let $NewsPub = $(".btn-pub-news");
    //发布按钮的点击事件
    $NewsPub.click(function () {
        let titleVal = $("#news-title").val();
        // 获取内容  wang editor自带的获取内容的方式  html()带格式 text()纯文本
        let contentHtml = filterXSS(editor.txt.html());
        // let contentText = editor.txt.text();

        let newsId = $(this).data("news-id");
        let data = {
            "title": titleVal,
            "content": contentHtml,
        };
        // if(newsId) data["news-id"] = newsId;
        $.post({
            url: "/conn/news-pub/",
            data: data,
            success: res => {

                // console.log(res);
                if (res["code"] === 0) {
                    // {"text":"", }
                    let news = res['data'];
                    if (newsId) {
                        fAlert.alertNewsSuccessCallback("新闻更新成功", "查看新闻", () => {
                            // 跳到首页
                            // window.location.href = `/conn/detail/${news.news_id}`;
                        })

                    } else {
                        fAlert.alertSuccessCallback("动态发表成功",  () => {
                        window.location.href = `/conn/dis/`;
                        })
                    }

                } else {
                    fAlert.alertErrorToast(res["msg"]);
                }
            },
            error: err => {
                console.log(err);
            }
        })
    });









});