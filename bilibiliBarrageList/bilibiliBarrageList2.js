



    // 执行排序
    data_sort(data_list, 0, data_list.length - 1, data_arr);

    // 修改弹幕列表
    $(".bui-collapse-header").bind("click", function () {
        var clearInter = setInterval(function () {
            if ($(".player-auxiliary-danmaku-load-status").css("display") == "none") {
                list_change(data_list, data_arr);
                clearInterval(clearInter);
            }
        }, 100);
    });

// 获取当前视频播放秒数
function get_now_s() {
    var time_now = $('.bilibili-player-video-time-now')[0].innerHTML.split(":");
    $.each(time_now, function (i) {
        time_now[i] = parseInt(time_now[i]);
    })
    return time_m_s(time_now);
}

function list_change(data_list, data_arr) {
    // 修改页面控制
    $(".player-auxiliary-danmaku-btn-time").removeAttr("orderby");
    $(".player-auxiliary-danmaku-btn-danmaku").removeAttr("orderby");
    $(".player-auxiliary-danmaku-btn-date").removeAttr("orderby");
    $(".player-auxiliary-danmaku-function > .player-auxiliary-danmaku-btn-danmaku")[0].innerHTML = "滚动弹幕(共" + data_arr.length + "条)";

    // 弹幕排序
    list_sort(data_list, data_arr);

    // 开启与停止滚动控制
    // $('.player-auxiliary-danmaku-function').click(function () {
    //     if () {

    //     } else {
    //         list_lighting();
    //         list_roll();
    //     }
    // });
}

function list_sort(data_list, data_arr) {
    // 破坏初始列表结构
    $(".player-auxiliary-danmaku-wrap > div > ul").empty();
    $(".player-auxiliary-danmaku-wrap > .player-auxiliary-danmaku-contaner").removeClass("player-auxiliary-danmaku-contaner player-auxiliary-bscrollbar");
    $(".player-auxiliary-danmaku-wrap").off();
    $(".player-auxiliary-danmaku-wrap > div > ul").off();

    // 清除BFC
    var div = document.createElement("div");
    var nothing = document.createTextNode(".");
    div.appendChild(nothing);
    $(".player-auxiliary-danmaku-wrap > div > ul")[0].appendChild(div);
    $(div).addClass("BFC-nothing");
    $(".BFC-nothing").css("opacity", "0");

    // 构造有序列表
    $(data_arr).each(function (i, v) {
        var li = document.createElement("li");
        var span1 = document.createElement("span");
        var span2 = document.createElement("span");
        var span3 = document.createElement("span");
        var span4 = document.createElement("span");
        var text1 = document.createTextNode(time_s_m(data_list[i][0]));
        var text2 = document.createTextNode(v);
        var text3 = document.createTextNode(data_s_d(data_list[i][4]));
        var text4 = document.createTextNode(">");
        span1.appendChild(text1);
        span2.appendChild(text2);
        span3.appendChild(text3);
        span4.appendChild(text4);
        $(li).attr("dmno", i);
        $(span2).attr("title", v);
        $(li).addClass("danmaku-info-row");
        $(span1).addClass("danmaku-info-time");
        $(span2).addClass("danmaku-info-danmaku");
        $(span3).addClass("danmaku-info-date");
        $(span4).addClass("danmaku-info-animate");
        li.appendChild(span1);
        li.appendChild(span2);
        li.appendChild(span3);
        li.appendChild(span4);
        $(".player-auxiliary-danmaku-wrap > div > ul")[0].appendChild(li);
        $('.danmaku-info-animate').css({
            'position': 'absolute',
            'width': '15px',
            'height': '100%',
            'padding': '0',
            'left': '0px',
            'font-size': '15px',
            'color': 'rgb(1,185,245)',
            'transition': '1s ease-in-out'
        });
    });

    // 播放动画(监听视频播放进度)
    var isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
    player_animate(data_list, get_now_s());
    setInterval(function () {
        if (isChange != $(".bilibili-player-video-time-now")[0].innerHTML) {
            player_animate(data_list);  // 动画播放
            isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
        }
    }, 1000);
}

// 播放动画
function player_animate(data_list) {
    var time_now_s = get_now_s();
    var length = data_list.length;
    var begin = -1, end = -1;
    for (var i = 0; i < length; i++) {
        if (Math.floor(data_list[i][0]) < time_now_s) continue;
        if (Math.floor(data_list[i][0]) > time_now_s) break;
        if (begin != -1) end++;
        if (begin == -1) begin = end = i;
    }
    if (end == -1) return;
    var li_height = parseFloat($(".player-auxiliary-danmaku-wrap > div > ul > li").css("height").replace("px", ""));
    var li_width = parseFloat($(".player-auxiliary-danmaku-wrap > div > ul > li").css("width").replace("px", ""));
    for (var i = begin; i <= end; i++) {
        if (length > 15 && i > 11) $(".player-auxiliary-danmaku-wrap > div > ul > li:first").css("margin-top", "-" + (i - 11) * li_height + "px");  // 列表滚动
        $($('.player-auxiliary-danmaku-wrap > div > ul > li')[i]).find(".danmaku-info-animate").css("left", li_width);  // 播放动画
    }
}