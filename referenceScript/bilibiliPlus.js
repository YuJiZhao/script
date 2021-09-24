// ==UserScript==
// @name    	超强B站哔哩哔哩使用助手
// @description B站哔哩哔哩使用加强、番剧大会员VIP视频解析、视频下载、一键三联、浏览记录提醒（搜索结果、用户主页以观看提示，避免重复浏览...）
// @author    	潮玩天下
// @namespace   chaowantianxia_bilibili_script
// @version    	1.0.4
// @include	   	*://www.bilibili.com/**
// @include     *://search.bilibili.com/**
// @include     *://space.bilibili.com/**
// @connect     api.bilibili.com
// @grant       GM_openInTab
// @grant       GM.openInTab
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant    	GM_addStyle
// @grant    	GM_xmlhttpRequest
// @grant    	GM_getResourceText
// @grant    	GM_registerMenuCommand
// @grant    	unsafeWindow
// @license     AGPL License
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @run-at     	document-start
// @original-author   爱画画的猫
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/418804
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 常用的工具方法 
     */
    function ToolObject() {
        this.GMgetValue = function (name, value) {
            if (typeof GM_getValue === "function") {
                return GM_getValue(name, value);
            } else {
                return GM.getValue(name, value);
            }
        };
        this.GMsetValue = function (name, value) {
            if (typeof GM_setValue === "function") {
                return GM_setValue(name, value);
            } else {
                return GM.setValue(name, value);
            }
        };
        this.GMaddStyle = function (css) {
            var myStyle = document.createElement('style');
            myStyle.textContent = css;
            var doc = document.head || document.documentElement;
            doc.appendChild(myStyle);
        };
        this.GMopenInTab = function (url, open_in_background) {
            if (typeof GM_openInTab === "function") {
                GM_openInTab(url, open_in_background);
            } else {
                GM.openInTab(url, open_in_background);
            }
        };
        this.addScript = function (url) {
            var s = document.createElement('script');
            s.setAttribute('src', url);
            document.body.appendChild(s);
        };
        this.randomNumber = function () {
            return Math.ceil(Math.random() * 100000000);
        };
        this.request = function (mothed, url, param) {
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    url: url,
                    method: mothed,
                    data: param,
                    onload: function (response) {
                        var status = response.status;
                        var playurl = "";
                        if (status == 200 || status == '200') {
                            var responseText = response.responseText;
                            resolve({
                                "result": "success",
                                "data": responseText
                            });
                        } else {
                            reject({
                                "result": "error",
                                "data": null
                            });
                        }
                    }
                });
            })
        };
        this.getBilibiliBV = function () {
            var pathname = window.location.pathname;
            var bv = pathname.replace("/video/", "").replace("/", "");
            return bv;
        }
    }

    /**
     * b站视频下载
     * @param {Object} toolObject
     */
    function BilibiliVideoDownloadHelper(toolObject) {
        this.toolObject = toolObject;
        this.downloadResutError = function ($btn) {
            alert("下载出错了");
            $btn.text("下载视频（最高请）");
            $btn.removeAttr("disabled");
        };
        this.downloadResutSuccess = function ($btn) {
            $btn.text("下载视频（最高请）");
            $btn.removeAttr("disabled");
        };
        this.downloadVideo = function ($btn) {
            let bv = toolObject.getBilibiliBV();
            if (!bv) {
                this.downloadResutError();
            } else {
                //bv转av
                toolObject.request("get", "http://api.bilibili.com/x/web-interface/archive/stat?bvid=" + bv, null).then((resultData) => {
                    let dataJson = JSON.parse(resultData.data);
                    if (!!dataJson && dataJson.code === 0 && !!dataJson.data) {
                        let aid = dataJson.data.aid;
                        if (!aid) {
                            this.downloadResutError($btn);
                        } else {
                            //获取cid
                            toolObject.request("get", "https://api.bilibili.com/x/web-interface/view?aid=" + aid, null).then((resultData2) => {
                                let dataJson2 = JSON.parse(resultData2.data);
                                if (!!dataJson2 && dataJson2.code === 0 && !!dataJson2.data) {
                                    let aid = dataJson2.data.aid;
                                    let bvid = dataJson2.data.bvid;
                                    let cid = dataJson2.data.cid;
                                    if (!aid || !bvid || !cid) {
                                        this.downloadResutError($btn);
                                    } else {
                                        //获取播放链接
                                        toolObject.request("get", "https://api.bilibili.com/x/player/playurl?avid=" + aid + "&cid=" + cid + "&qn=112", null).then((resultData3) => {
                                            let dataJson3 = JSON.parse(resultData3.data);
                                            if (!!dataJson3 && dataJson3.code === 0 && !!dataJson3.data) {
                                                this.downloadResutSuccess($btn);
                                                window.open(dataJson3.data.durl[0].url);
                                            }
                                        }).catch((errorData) => {
                                            this.downloadResutError($btn);
                                        });
                                    }
                                }
                            }).catch((errorData) => {
                                this.downloadResutError($btn);
                            });
                        }
                    }
                }).catch((errorData) => {
                    this.downloadResutError();
                });
            }
        }
        this.createElementHtml = function () {
            let randomNumber = this.toolObject.randomNumber();
            let cssText =
                `
                      #bilibili_exti_` + randomNumber + `{padding:10px;}
                      #bilibili_exti_` + randomNumber + ` >.self_s_btn{background-color:#FB7299; color:#FFF; font-size:10px;display:inline-block; margin-right:15px;padding:2px 4px;border-radius:3px;cursor:pointer;}
                  `;
            let htmlText =
                `
                      <div id="bilibili_exti_` + randomNumber + `">
                          <span class="self_s_btn" id="download_s_` + randomNumber + `">下载视频（最高请）</span>
                          <span class="self_s_btn" id="focus_s_` + randomNumber + `">一键三联</span>
                      </div>
                  `;
            setTimeout(() => {
                if ($("#bilibili-player").html().length >= 10) {
                    $("body").prepend("<style>" + cssText + "</style>");
                    $("#viewbox_report div.video-data").append(htmlText);
                    let $that = this;
                    $("#download_s_" + randomNumber).on("click", function () {
                        $(this).attr("disabled", "disabled");
                        $(this).text("下载视频（准备中）")
                        $that.downloadVideo($(this));
                    });
                    $("#focus_s_" + randomNumber).on("click", function () {
                        $("#arc_toolbar_report .like").click();
                        $("#arc_toolbar_report .coin").click();
                    });
                }
            }, 2500);
        }
        this.start = function () {
            if (window.location.pathname.indexOf("/video") != -1 && window.location.host === "www.bilibili.com") {
                this.createElementHtml();
            }
        }
    }

    /**
     * 记录b站的观看记录
     * @param {Object} toolObject
     */
    function RecordViewFunction(toolObject) {
        this.toolObject = toolObject;
        this.localCacheName = "bilibili_video_record";
        this.recordOneVideo = function () {
            let promise = new Promise((resolve, reject) => {
                let bv = toolObject.getBilibiliBV();
                let cacheText = toolObject.GMgetValue(this.localCacheName);
                cacheText = !cacheText ? "" : cacheText + "#";
                let viewArray = cacheText.split("#");
                let len = viewArray.length;
                let limitNum = 2000; //最多保存2000个视频记录
                if (len >= limitNum) { //超过则清除最开始的1/4
                    let newCacheText = "";
                    let limitNumHalf = limitNum / 4;
                    for (var i = 0; i < len; i++) {
                        if (i >= limitNumHalf) {
                            newCacheText += "#" + viewArray[i];
                        }
                    }
                    cacheText = newCacheText;
                }
                if (cacheText.indexOf(bv) == -1) {
                    cacheText += bv;
                    toolObject.GMsetValue(this.localCacheName, cacheText);
                }
                resolve({
                    "result": "success"
                });
            });
        };
        this.searchPageRemindHtml = function ($ele, top = 8, right = 8) {
            $ele.css("position", "relative");
            $ele.append("<div style='position:absolute; top:" + top + "px; right:" + right + "px; background-color: rgba(0,0,0,0.8); border-radius:3px; font-size:10px; color:#FFF;padding:2px 5px;'>已看</div>");
        };
        this.searchPageRemind = function () {
            let $that = this;
            setInterval(function () {
                let cacheText = toolObject.GMgetValue($that.localCacheName);
                cacheText = !cacheText ? "" : cacheText;
                $(".video-list .video-item").each(function () { //搜索结果
                    if ($(this).attr("dealxll") !== "true") {
                        var videourl = $(this).children("a").attr("href");
                        if (cacheText.indexOf(videourl.split("?")[0].replace("//www.bilibili.com/video/", "")) != -1) {
                            $that.searchPageRemindHtml($(this));
                        }
                        $(this).unbind("click").bind("click", () => { //循环操作，单独绑定
                            $that.searchPageRemindHtml($(this));
                        })
                        $(this).attr("dealxll", "true");
                    }
                });
                $("#page-index .small-item").each(function () { //用户主页
                    if ($(this).attr("dealxll") !== "true") {
                        var videourl = $(this).children("a").attr("href");
                        if (cacheText.indexOf(videourl.split("?")[0].replace("//www.bilibili.com/video/", "")) != -1) {
                            $that.searchPageRemindHtml($(this), 12, 12);
                        }
                        $(this).unbind("click").bind("click", () => { //循环操作，单独绑定
                            $that.searchPageRemindHtml($(this), 12, 12);
                        })
                        $(this).attr("dealxll", "true");
                    }
                });
                $("#submit-video-list .small-item").each(function () { //用户投稿
                    if ($(this).attr("dealxll") !== "true") {
                        var videourl = $(this).children("a").attr("href");
                        if (cacheText.indexOf(videourl.split("?")[0].replace("//www.bilibili.com/video/", "")) != -1) {
                            $that.searchPageRemindHtml($(this), 12, 12);
                        }
                        $(this).unbind("click").bind("click", () => { //循环操作，单独绑定
                            $that.searchPageRemindHtml($(this), 12, 12);
                        })
                        $(this).attr("dealxll", "true");
                    }
                });
            }, 100);
        }
        this.start = function () {
            let $that = this;
            if (window.location.pathname.indexOf("/video") != -1 && window.location.host === "www.bilibili.com") {
                let currentHref = "";
                setInterval(() => { //需要循环存储
                    if (window.location.href !== currentHref) {
                        this.recordOneVideo();
                        currentHref = window.location.href;
                    }
                }, 100);
            }
            //搜索结果和用户主页已经看过的视频提醒
            if (window.location.host === "search.bilibili.com" || window.location.host === "space.bilibili.com") {
                this.searchPageRemind();
            }
            GM_registerMenuCommand("清空脚本保存的浏览记录", function () {
                if (confirm('是否要清空脚本保存的浏览记录？清空后将不可恢复...')) {
                    $that.toolObject.GMsetValue($that.localCacheName, "");
                }
            });
        };
    }

    /**
     * B站大会员解析
     * @param {Object} toolObject
     */
    function BilibiliVipVideo(toolObject) {
        this.toolObject = toolObject;
        this.createElementHtml = function () {
            let randomNumber = this.toolObject.randomNumber();
            let cssText = `
                      #script_vip_bangumi_ii_` + randomNumber + `{
                          position:fixed;
                          top:150px;
                          left:0px; 
                          padding:5px 0px; 
                          cursor:pointer;
                          text-align:center;
                          width:50px;
                      }
                      #script_vip_bangumi_ii_` + randomNumber + `>img{
                          width:100%; 
                          display:inline-block;
                          vertical-align:middle;
                      }
                  `;
            let imgBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABEpJREFUeF7tm19oHEUcx7+/7c61IkpQWooiVIovIoUiTdGC9uqTPuhDK1RUsNjcXK1Cbi8tLQoq/g325iqoub2UKCj2pQEV0SdtfFBUECrFR1ELPtgiohXb3F72J3vJJXe7c8kmt2u93Ozbzcz+5jef+c13f7/shtDnF/X5+mEAmAjocwLmCPR5ABgR1B4BPvrG9d5l8RCBdoN4Z09HCdMUgyfFOu8kvfLk7+G1aAHUnLHHCNbbPb3wkPMMf19GHXgnFgDPcU8B2L2aAACYFEruiQegUD3d86EfXinTlCjnsgZAiIBWAzwTAeYIGA0wItjrCZB5CoQzIfMYNHmASYRWnAkyTWnrgqWEstN9nYqMpr2Y9xHxLQzcGKtm6S4VplGhckfCE3mO+yWAOzs48JVQcofmni8APCeUPN3a5w2P7YRlzbb5flYcP6CHHta2Q+7mmRm6G4QXmPmGjjC6AUDAL7aSm8LGp53KIxboXd2kPvjRtSr/XmtfrVjdRszfAtiVFIA2iI77bABXC6EbAIFBAu2xVW5Ss6Osm1AoGakzak6lRCAnLQCBH57j/gFgIOJT1wCITtml3IMaAB8CuD/U/pFQ8gHN2F8BBGGaSgQE89Ucd5iAcuIAAoP2jLWRXh/6rdV4vVi9l5k/aW0jovvsUu7TtnGF6l4mPjnXlhqAS8Njm2zL+ikVAAAfESo/GtnZgnsehPWNdsYFUZYbortf+QCgZlQsG0CbSC4YD8T0+fBcNcc9R8BNbe3dHoHG2hhnMmW5NTJhofImET0xO4bfypTzB1vH8FMT6+vCO9/SlggAAn62lbxZc9QCod2WOIDGMYB1B6mhr9sWWDgxWKeZbxr9vGY7lfcHDsxfnuM+DeDFrgHQmkDl5y8ilGyV+zgKoPo3wFenAoDB4xmVz2mofxe0CSVv1/SdBXBbNwDCNjv95pHxLXXf/z7Sn8QRmDN6USh5bWSRRbeRKImSfLW1r1Y4MUhz0fFfAKgVKmNElE8TAHzGw2vL8v22Y3DI3Rz8ptfkj63t9aI7wYx9IYeWrQFxIoCLlVvrTD9oxyYYAYHSfS7K+XviOOU57j8ArkobgDcyvgu+/1lHnxIFAOCiwMB1o/LPxSBMF6p7rYVn//xQ27KydGyoLddfSS0Q7LjHPGjB2sHA/kU3JGkAAJ4RSr602KSe4waFz12RMZaVFcsE0CEPiBOEs2OSBtCpQGp6dOHw6DUD9YG/tB6uBgANqD5tzRzPndEt0nOqRwF+WQ/Az4pj7eXuUkfgfxcBDQDAREbJx/UA3GbhE+22VgmAxnNfU/ZOj4xvsXTJSBPFagIQiIs2zBf7c9lS9yzVH1/6FkYmLYIr8eGK3mMAmBcj5sWIeTGy4hcjV1S9EprciKARQSOCRgSNCMb9ULLfP5Xt+4+l+/5z+YRSj54wY/5nqCe2KUUnTQSkCLcnTJsI6IltStHJvo+AfwHPnRxuUg8x3wAAAABJRU5ErkJggg==";
            let htmlText = `
                      <div id="script_vip_bangumi_ii_` + randomNumber + `">
                          <img src="` + imgBase64 + `">
                      </div>
                  `;
            let bodyInterval = setInterval(() => {
                if ($("body").length != 0) {
                    $("body").prepend("<style>" + cssText + "</style>");
                    $("body").append(htmlText);
                    $("#script_vip_bangumi_ii_" + randomNumber).on("click", () => {
                        this.toolObject.GMopenInTab("https://www.showxi.xyz/mov/s/?sv=9&url=" + window.location.href, false);
                    });
                    clearInterval(bodyInterval);
                }
            }, 100);
        }
        this.start = function () {
            if (window.location.host === "www.bilibili.com" && window.location.href.indexOf("/bangumi/play/") != -1) {
                setTimeout(() => {
                    this.createElementHtml();
                }, 1500);
            }
        };
    }

    //全局统一变量
    const toolObject = new ToolObject();
    try {
        (new BilibiliVideoDownloadHelper(toolObject)).start();
    } catch (e) {}

    try {
        (new RecordViewFunction(toolObject)).start();
    } catch (e) {}

    try {
        (new BilibiliVipVideo(toolObject)).start();
    } catch (e) {}
})();