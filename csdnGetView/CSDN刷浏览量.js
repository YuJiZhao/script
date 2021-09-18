// ==UserScript==
// @name         csdn自动刷浏览量
// @namespace    eyes
// @version      1.0.0
// @description  该脚本在个人主页开启时可以定时刷浏览量
// @author       eyes
// @match        https://blog.csdn.net/tongkongyu?spm=1000.2115.3001.5343
// @grant        none
// ==/UserScript==
var f1 = () => {
    setInterval(() => {
        var articles = document.getElementsByTagName('article');
        for (let i = 0; i < articles.length; i++) {
            let as = articles[i].getElementsByTagName('a')[0];
            as.onclick = (e) => {
                    if (e && e.preventDefault)
                        e.preventDefault();
                    else
                        window.event.returnValue = false;
                },
                as.click()
        }
        window.location.reload();
    }, 90000)
};
// f1();

// 引入jq库
var script = document.createElement("script");
script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
// 不新建页面打开链接
$('.article-item-box a').attr('target', 'self');
// 判断是否需要翻页
if ($('#pageBox').size()) {
    // 模拟点击博客
    $.each($('.article-item-box a'), (i, v) => {
        v.click();
        setTimeout(() => {
            window.history.go(-1)
        }, 500);
    });
    // 判断博客页数
    var pages = $('.ui-paging-container > ul > .ui-pager').size();
} else {
    // 
}

var script = document.createElement("script");
script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
$('.article-item-box a').attr('target', 'self');
$.each($('.article-item-box a'), (i, v) => {
    setTimeout(() => {
        v.click();
        setTimeout(() => {
            window.history.go(-1)
        }, 500)
    }, 500);
});

var script = document.createElement("script");
script.src = "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(script);
console.log(1);
$(document).delay(5000, () => console.log(2));
console.log(3);