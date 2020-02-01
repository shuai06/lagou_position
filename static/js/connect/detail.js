$(()=>{

let $delBtn = $(".del-myself-new");
let $loginComment = $('.please-login-comment').children("input");

let $commentBtn = $(".comment-btn");
let $commentInput = $('.logged-comment').children("input");
let $commentList = $(".comment-list");
// let afterxss = filterXSS();
//删除自己的文章
$delBtn.click(function () {
    let id = $("#nidid").attr("nid");
    fAlert.alertConfirm({
        "title": `你确定要删除此文章吗？`,
        "type":"error",
        'confirmText':"确认删除",
        "cancleText":"取消删除",
        "confirmCallback": function () {
            $.post({
                url:"/conn/del_my_new/",
                data:{
                    "id":id,
                },
                success: res =>{
                    if(res['code']===0){
                        window.message.showSuccess("删除成功");
                        window.location = "/conn/dis/";
                    }else{
                        fAlert.alertErrorToast(res['msg']);
                    }
                },
                error: err =>{
                    console.log(err);
                }
            })
        },
    })
});






// 发布评论的按钮
$commentBtn.click(function () {
    $.post({
      url: '/conn/add_comment/',
      data: {
        "content": $commentInput.val(),
        "news_id": $(this).data("news-id"),
      },
      success: res => {
        if (res["code"] === 0) {
          let data = res["data"];
          let comment = data["comment"];
          let pub_time = comment["pub_time"];
          let result = dateFormat(pub_time);
          let commentStr = `
            <li class="comment-item">
            <div class="comment-info clearfix">
              <img src="/static/images/avatar.jpeg" alt="avatar" class="comment-avatar">
              <span class="comment-user">${comment.author.username}</span>
              <span class="comment-pub-time">${result}</span>
            </div>
            <div class="comment-content comment_txt">${comment.content}</div>
          </li>
          `;
          $commentList.prepend(commentStr);
          $commentInput.val('');
        } else if (res["code"] === 403) {
          window.message.showError(res["msg"]);
          setTimeout(() => {
            window.location.href = '/auth/login/';
          }, 2000)
        }
      },
      error: err => {
        logErr(err);
      }
    })
  });


// 未登录用户的评论需要先登录
 $loginComment.focus(function () {
     setTimeout(() => {
         window.location.href = '/auth/login/';
      }, 1000)
  });


 // 获取评论
 $.post({
        url: "/conn/comment/list/",
        data: {
          "news_id": $commentBtn.data("news-id"),
        },
        success: res => {
          if (res["code"] === 0) {
            let data = res["data"];
            let comments = data["comments"];
            comments.forEach(comment => {
              let pub_time = comment["pub_time"];
              let result = dateFormat(pub_time);
              let commentStr = `
                <li class="comment-item">
                <div class="comment-info clearfix">
                  <img src="/static/images/avatar.jpeg" alt="avatar" class="comment-avatar">
                  <span class="comment-user">${comment.author.username}</span>
                  <span class="comment-pub-time">${result}</span>
                </div>
                <div class="comment-content comment_txt">${comment.content | escape}</div>
              </li>
              `;
              // $commentList.prepend(commentStr);
              $commentList.append(commentStr);
            })
          }
        }
})

















});