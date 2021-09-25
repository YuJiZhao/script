// 油猴脚本似乎无法是用加载完执行之类的函数，无奈之下我只好是用定时器监听页面加载情况
let clearInter = setInterval(() => {
    if ($(".bui-collapse-header")[0]) { // 监听列表是否加载完成
        clearInterval(clearInter);
        $(".bui-collapse-header").click(() => {
            let clear = setInterval(() => {
                if ($(".player-auxiliary-danmaku-load-status").css("display") == "none") { // 监听弹幕是否加载完成
                    clearInterval(clear);
                    // 排序
                    $(".player-auxiliary-danmaku-btn-time")[0].click();
                    // 滚动
                    listScroll();
                }
                console.log("弹幕加载定时器");
            }, 100);
        });
    }
    console.log("列表加载定时器");
}, 100)

// 执行脚本
let listScroll = () => {
    // 修改页面控制
    $(".player-auxiliary-danmaku-btn-time").removeAttr("orderby");
    $(".player-auxiliary-danmaku-btn-danmaku").removeAttr("orderby");
    $(".player-auxiliary-danmaku-btn-date").removeAttr("orderby");

    // 破环初始列表结构
    let danmaku_num = $(".player-auxiliary-danmaku-btn-danmaku > span")[0].innerHTML;
    $(".player-auxiliary-danmaku-function > .player-auxiliary-danmaku-btn-danmaku")[0].innerHTML = "正在滚动(共" + danmaku_num + "条)";  // 修改列表
    $(".player-auxiliary-danmaku-btn-time > i").css("display", "none");  // 隐藏排序图标
    $(".player-auxiliary-danmaku-wrap > .player-auxiliary-danmaku-contaner").removeClass("player-auxiliary-danmaku-contaner player-auxiliary-bscrollbar");  // 禁止滚轮事件

    // 监听视频进度
    videoListen();
}

// 实现监听视频进度
let videoListen = () => {
    var isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
    setInterval(function () {
        if (isChange != $(".bilibili-player-video-time-now")[0].innerHTML) {
            let now_s = get_now_s();
            // 动画播放
            animatePlayer(now_s);
            // 弹幕滚动
            listScroll(now_s);
            isChange = $(".bilibili-player-video-time-now")[0].innerHTML;
        }
    }, 1000);
}

// 实现滚动
let listScroll = (now_s) => {

}

// 实现动画
let animatePlayer = (now_s) => {

}

// 时间格式转换(分转秒)
function time_m_s(a) {
    if (a.length == 2) return a[0] * 60 + a[1];
    else return a[0] * 3600 + a[1] * 60 + a[2];
}

// 获取当前视频播放秒数
function get_now_s() {
    var time_now = $('.bilibili-player-video-time-now')[0].innerHTML.split(":");
    $.each(time_now, function (i) {
        time_now[i] = parseInt(time_now[i]);
    })
    return time_m_s(time_now);
}