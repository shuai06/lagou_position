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
        $.post({
            url: "/conn/list/",
            data: {
                "page": page,
                "parm":"all",
            },
            success: res => {
                // 成功的
                // console.log(res);
                if (res["code"] === 0) {
                    let newses = res["data"]['newses'];
                    // let newses = data["newses"];

                    if (newses.length > 0) {
                        // 遍历数据
                        newses.forEach((news) => {
                            let newTime = new Date((news["pub_time"])).toJSON();
                            let newTimes = new Date(+new Date(newTime)+8*3600*1000);
                            let newT = newTimes.toISOString();
                            let pub_times = newT.replace(/T/g,' ').replace(/\.[\d]{3}Z/,'').replace('-','年').replace('-','月').replace('-','日');
                            let pub_time = pub_times.substring(0,pub_times.length -3);
                            // `` 模板字符串 ${news.title}
                            let newsStr = `
                                <li class="news-item">
                                  <div class="news-content">
                                    <h4 class="news-title"><a href="/conn/detail/${news.id}" target="_blank">${news.title}</a></h4>
                                    <div class="news-details "> ${news.content} </div>
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