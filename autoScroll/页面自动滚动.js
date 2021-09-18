

    // ==UserScript==
    // @name         页面自动滚动
    // @namespace    eyes
    // @version      1.5.0
    // @description  通过使用快捷键实现页面自动滚动
    // @author       eyes
    // @match        *://*/*
    // @grant        none
    // @supportURL   https://eyesblog.gitee.io/
    // ==/UserScript==

    (function() {
        'use strict';
            let speed = 0;
            // 获取滑动位置
            let getScrollTop = () => {
                var scrollTop = 0,
                    bodyScrollTop = 0,
                    documentScrollTop = 0;
                if (document.body) {
                    bodyScrollTop = document.body.scrollTop;
                }
                if (document.documentElement) {
                    documentScrollTop = document.documentElement.scrollTop;
                }
                scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
                return scrollTop;
            }
            //浏览器视口的高度
            let getWindowHeight = () => {
                var windowHeight = 0;
                if (document.compatMode == 'CSS1Compat') {
                    windowHeight = document.documentElement.clientHeight;
                } else {
                    windowHeight = document.body.clientHeight;
                }
                return windowHeight;
            }
            //文档的总高度
            let getScrollHeight = () => {
                var scrollHeight = 0,
                    bodyScrollHeight = 0,
                    documentScrollHeight = 0;
                if (document.body) {
                    bodyScrollHeight = document.body.scrollHeight;
                }
                if (document.documentElement) {
                    documentScrollHeight = document.documentElement.scrollHeight;
                }
                scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
                return scrollHeight;
            }
            // 滚动事件
            setInterval(() => {
                // 判断页面是否滑到底部
                let bottomFlag = (getScrollTop() + getWindowHeight() == getScrollHeight()) ? true : false;
                let topFlag = (getScrollTop() == 0) ? true : false;
                if (bottomFlag || topFlag) {
                    speed = 0;
                } else {
                    document.documentElement.scrollTop += speed;
                }
            }, 5)
            // 判断是否需要滚动
            document.onkeydown = (e) => {
                e = event || window.event;
                // 同时按上键与alt键向上滚动
                if (e && e.keyCode == 38 && e.altKey) { 
                    let bottomFlag = (getScrollTop() + getWindowHeight() == getScrollHeight()) ? true : false;
                    if (bottomFlag) {
                        document.documentElement.scrollTop += -1;
                    }
                    speed -= 1.5;
                }
                // 同时按下键与alt键向下滚动
                if (e && e.keyCode == 40 && e.altKey) { 
                    let topFlag = (getScrollTop() == 0) ? true : false;
                    if (topFlag) {
                        document.documentElement.scrollTop += 1;
                    }
                    speed += 1.5;
                }
                // 同时按 CTRL + ALT 键停止滚动
                if (e && e.altKey && e.ctrlKey) {
                    speed = 0;
                }
            }
            // 单击页面停止滚动
            document.onclick = () => {
                speed = 0;
            }
            // 滑动滚轮页面停止滚动
            document.onmousewheel = () => {
                speed = 0;
            }
            document.addEventListener("DOMMouseScroll", () => {
                speed = 0;
            })
    })();

