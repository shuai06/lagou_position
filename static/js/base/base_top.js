$(document).ready(function () {

    // 这种做法不能实际生效
    // $(".navbar-nav .haha").click(function (e) {
    //     // e.preventDefault();
    //     $(".navbar-nav .haha.active").removeClass("active");
    //     $(this).addClass("active");
    // });

    // 这个方法没试试
    // var location = window.location.href;
    // // var id = location.substring(location.lastIndexOf('/')+1);
    // $("#"+id).addClass("active");


    //  这里用最笨的办法哈哈哈
    var loca = window.location.href;
    var id_str = loca.split('/')[3];
    if(id_str == "analyze"){
        $("#t_analyze").addClass("active");
    }else if(id_str == "connect"){
        $("#t_connect").addClass("active");
    }else if(id_str == "other"){
        $("#t_other").addClass("active");
    }else if(id_str == "" || id_str == undefined){
        $("#t_index").addClass("active");
    }else {
        "顶部导航没选中哦～～～"
    }


});


