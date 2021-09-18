  // ==UserScript==
  // @name         页面自动滚动
  // @namespace    eyes
  // @version      1.4.0
  // @description  通过使用快捷键实现页面自动滚动
  // @author       eyes
  // @match        *://*/*
  // @grant        none
  // @supportURL   https://eyesblog.gitee.io/
  // ==/UserScript==

    (function () {
        'use strict';
        let speed = 0;
        // 获取滑动位置
        var getScrollTop = function() {
            var scrollTop = 0,
                bodyScrollTop = 0,
                documentScrollTop = 0;
            if (document.body) bodyScrollTop = document.body.scrollTop;
            if (document.documentElement) documentScrollTop = document.documentElement.scrollTop;
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
            return scrollTop;
        }

        //浏览器视口的高度
        var getWindowHeight = function() {
            var windowHeight = 0;
            if (document.compatMode == 'CSS1Compat') 
                windowHeight = document.documentElement.clientHeight;
            else
                windowHeight = document.body.clientHeight;
            return windowHeight;
        }

        //文档的总高度
        var getScrollHeight = function() {
            var scrollHeight = 0,
                bodyScrollHeight = 0,
                documentScrollHeight = 0;
            if (document.body) bodyScrollHeight = document.body.scrollHeight;
            if (document.documentElement) documentScrollHeight = document.documentElement.scrollHeight;
            scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
            return scrollHeight;
        }

        // 判断是否到顶或底
        var isBottomOrTop = function() {
            var bottomFlag = (getScrollTop() + getWindowHeight() == getScrollHeight()) ? true : false;
            var topFlag = (getScrollTop() == 0) ? true : false;
            if (bottomFlag || topFlag) return true;
            else return false;
        }

        // 滚动事件
        function scroll() {
            var clearInter = setInterval(function() {
                document.documentElement.scrollTop += speed;
                if(isBottomOrTop) clearInterval(clearInter);
            }, 5);
            // 单击页面停止滚动
            document.onclick = function() {
                speed = 0;
                clearInterval(clearInter);
            }
            // 滑动滚轮页面停止滚动
            document.DOMMouseScroll = function() { 
                speed = 0;
                clearInterval(clearInter); 
            }
            // 同时按 CTRL + ALT 键停止滚动
            document.onkeydown = function() {
                e = event || window.event;
                if (e && e.altKey && e.ctrlKey) {
                    speed = 0;
                    clearInterval(clearInter);
                };
            }
        }

        // 判断是否需要滚动
        document.onkeydown = function(e) {
            e = event || window.event;
            // 同时按上键与alt键向上滚动
            if (e && e.keyCode == 38 && e.altKey) {
                var bottomFlag = (getScrollTop() + getWindowHeight() == getScrollHeight()) ? true : false;
                if (bottomFlag) document.documentElement.scrollTop += -1;
                speed -= 1.5;
                scroll()
            }
            // 同时按下键与alt键向下滚动
            if (e && e.keyCode == 40 && e.altKey) {
                var topFlag = (getScrollTop() == 0) ? true : false;
                if (topFlag) document.documentElement.scrollTop += 1;
                speed += 1.5;
                scroll();
            }
        }
    })();