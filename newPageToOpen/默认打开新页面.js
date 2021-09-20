// ==UserScript==
// @name         新建页面打开链接
// @version      1.0
// @description  none
// @author       eyes++
// @match        https://github.com/*
// @match        https://www.google.com/search/*
// @supportURL   https://github.com/YuJiZhao/script
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    document.onmousemove = () => {
        // 给每个a标签都加上target属性
        let a = document.getElementsByTagName("a");
        let length = a.length;
        for (let i = 0; i < length; i++) {
            if (!a[i].getAttribute("target")) a[i].setAttribute("target", "_blank");
        }
        // 解绑
        document.onmousemove = null;
    }
})();