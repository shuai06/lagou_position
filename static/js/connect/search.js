$(()=>{

    /*=== load more =====*/
    let $moreBtn = $(".btn-more");
    let $newsContain = $(".news-contain");
    let $newsList = $(".news-list");

    // 这个是点击加载的
    $moreBtn.on('click', function () {

        $newsContain.append(`<div class="loading-img"></div>`);
        let $loadImg = $(".loading-img");
        let page = $(this).attr("data-page");
        let s_key = $(".news-list").attr("s_k");
        $.post({
            url: "/conn/list/",
            data: {
                "page": page,
                "parm":s_key,
            },
            success: res => {
                // 成功的
                if (res["code"] === 0) {
                    let data = res["data"];
                    let newses = data["newses"];

                    if (newses.length > 0) {
                        // 遍历数据
                        newses.forEach((news) => {
                            console.log(news);
                            let pub_time = news["pub_time"];
                            // `` 模板字符串 ${news.title}
                            let newsStr = `
                                <li class="news-item">
                                  <div class="news-content">
                                    <h4 class="news-title"><a href="/conn/detail/${news.id}" target="_blank">${news.title}</a></h4>
<!--                                     <p class="news-details" >${news.content}</p>-->
                                    <div class="news-other">
                                      <span class="news-time">${pub_time}</span>
                                      <span class="news-author">${news.author.username}</span>
                                    </div>
                                  </div>
                                </li>
                              `;
                            $newsList.append(newsStr);
                        })
                    } else {
                        // 内容空的时候， 去除掉按钮
                        $(this).remove();
                        $(".news-list").append("<li style='list-style: none; font-size: 19px;margin-left: 142px; margin-top: 90px;'><div> 😳别滑了, 人家是有底线的哦～</div></li>");

                    }

                    $loadImg.remove();
                }
                page++; // page
                $(this).attr("data-page", page);
            },
            error: err => {
                console.log(err);
            }
        })
        // }, 200)
    });















});