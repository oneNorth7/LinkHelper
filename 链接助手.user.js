// ==UserScript==
// @name            链接助手
// @namespace       https://github.com/oneNorth7/LinkHelper
// @match           *://*/*
// @version         1.5.0
// @author          一个北七
// @run-at          document-body
// @description     常用网盘自动填写密码; 跳转页面自动跳转; 文本转链接; 净化跳转链接; 维基百科及镜像、Mozilla开发者自动切换中文(可控), 维基百科、谷歌开发者链接转为镜像链接; 新标签打开链接(可控)
// @icon            https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png
// @noframes
// @license         GPL-3.0 License
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_notification
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @created         2021年3月19日 09:48:14
// ==/UserScript==

$(function () {
    "use strict";

    const scriptInfo = GM_info.script,
        locHost = location.host,
        locHref = location.href,
        locHash = location.hash,
        locPath = location.pathname;

    let t = {
        showNotice(msg) {
            GM_notification({
                text: msg,
                title: scriptInfo.name,
                image: scriptInfo.icon,
                highlight: false,
                silent: false,
                timeout: 1500,
            });
        },

        clog(msg) {
            console.group("链接助手");
            console.log(msg);
            console.groupEnd();
        },

        get(name, def) {
            return GM_getValue(name, def);
        },

        set(name, value) {
            GM_setValue(name, value);
        },

        delete(name) {
            GM_deleteValue(name);
        },

        registerMenu(title, func) {
            return GM_registerMenuCommand(title, func);
        },

        unregisterMenu(menuID) {
            GM_unregisterMenuCommand(menuID);
        },

        http(link, s = false) {
            return link.startsWith("http")
                ? link
                : (s ? "https://" : "http://") + link;
        },

        hashcode() {
            return locHash.slice(1);
        },

        clean(src, str) {
            for (let s of str) {
                src = src.replace(s, "");
            }
            return src;
        },

        loop(func, times) {
            let tid = setInterval(() => {
                if (times <= 0) clearInterval(tid);
                func();
                this.clog(times);
                times--;
            }, 100);
        },
    };

    let url_regexp = /(\w(?:[\w._-])+@\w[\w\._-]+\.(?:com|cn|org|net|info|tv|cc|gov|edu)|(?:https?:\/\/|www\.)[\w_\-\.~\/\=\?&#]+|(?:\w[\w._-]+\.(?:com|cn|org|net|info|tv|cc|gov|edu))(?:\/[\w_\-\.~\/\=\?&#]*)?)/i;
    
    let Preprocess = {
        "www.38hack.com": function () {
            if (/http:\/\/www\.38hack\.com\/\d+\.html/.test(locHref)) {
                let lines = $("div.down-line");

                if (lines.length)
                    lines.last().append(lines.first().prev().prev());
            }
        },

        "www.mikuclub.xyz": function () {
            if (/https:\/\/www\.mikuclub\.xyz\/\d+/.test(locHref)) {
                let password = $(".password1"),
                    link = $("a.download");
                if (password.length && link.length)
                    link[0].hash = password[0].value;
            }
        },

        "www.acggw.com": function () {
            if (/https:\/\/www\.acggw\.com\/\d+\.html/.test(locHref)) {
                let paragraphs = $(".single-content>p"),
                    weiyun = null,
                    mega = null;
                for (let p of paragraphs) {
                    let text = $(p).text();
                    if (text.startsWith("链接：")) weiyun = $(p);
                    if (weiyun && text.startsWith("密码："))
                        weiyun.text(
                            weiyun.text() + "#" + text.replace("密码：", "")
                        );
                    if (mega && text.startsWith("国外M盘："))
                        mega.text(
                            mega.text() + "#" + text.replace("国外M盘：", "")
                        );
                    if (text.startsWith("国外M盘：http")) mega = $(p);
                }
            }
        },

        "www.olecn.com": function () {
            if (
                /http:\/\/www\.olecn\.com\/download\.php\?id=\d+/.test(locHref)
            ) {
                let link = $("div.panel-body a"),
                    pass = $("div.plus_l li:eq(3)");
                if (link.length && pass.length)
                    link[0].hash = pass
                        .text()
                        .trim()
                        .replace("网盘提取码 ：", "");
            }
        },

        "www.qiuziyuan.net": function () {
            if (
                /https:\/\/www\.qiuziyuan\.net\/(?:pcrj\/|Android\/\d+\.html)/.test(
                    locHref
                )
            ) {
                let filetit = $("div.filetit:first");
                for (let child of filetit.children()) {
                    if (child.href) {
                        let result = url_regexp.exec(child.innerHTML);
                        if (result) child.href = t.http(result[1]);
                    }

                    if (
                        child.innerHTML.startsWith("90网盘：") ||
                        child.innerHTML.includes("90pan")
                    ) {
                        let dom = filetit.next().next(),
                            result = /(?:90网盘：|\/\s*)(\d+)/.exec(dom.html());
                        if (result) child.href += "#" + result[1];
                    }
                }
            }
        },
    };

    if (Preprocess[locHost]) Preprocess[locHost]();

    let YunDisk = {
        sites: {
            "pan.baidu.com": {
                // 百度云
                inputSelector: "#accessCode",
                buttonSelector: "#submitBtn",
                regStr: "[a-z\\d]{4}",
            },

            "eyun.baidu.com": {
                // 百度企业网盘
                inputSelector: "input.share-access-code",
                buttonSelector: "a.g-button",
                regStr: "[a-z\\d]{4}",
            },

            "cloud.189.cn": {
                // 天翼云
                inputSelector: "#code_txt",
                buttonSelector: "a.btn-primary",
                regStr: "[a-z\\d]{4}",
                clickTimeout: 500,
            },

            "lanzou.com": {
                // 蓝奏云
                inputSelector: "#pwd",
                buttonSelector: "#sub, .passwddiv-btn",
                regStr: "[a-z\\d]{2,8}",
            },

            "n802.com": {
                // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 100, // >=90
            },

            "089u.com": {
                // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 100,
            },

            "ct.ghpym.com": {
                // 果核城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 200, // >=125
            },

            "474b.com": {
                // 爱之语城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 100,
            },

            "590m.com": {
                // 小众软件城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 200,
            },

            "www.90pan.com": {
                // 90网盘
                inputSelector: "#code",
                buttonSelector: "button.btn-info",
                regStr: "[a-z\\d]{4,6}",
            },

            "vdisk.weibo.com": {
                // 微盘
                inputSelector: "#keypass",
                buttonSelector: "div.search_btn_wrap>a",
                regStr: "[a-z\\d]{4}",
            },

            "pan.xunlei.com": {
                // 迅雷云盘
                inputSelector: "#__nuxt input.td-input__inner",
                buttonSelector: "#__nuxt button.td-button",
                regStr: "[a-z\\d]{4}",
                timeout: 1500,
                store: true,
                inputEvent: true,
            },

            "share.weiyun.com": {
                // 微云
                inputSelector: "input.input-txt",
                buttonSelector: "button.btn-main",
                regStr: "[a-z\\d]{4,6}",
                timeout: 500,
                inputEvent: true,
            },

            "115.com": {
                // 115网盘
                inputSelector: "input.text",
                buttonSelector: "a.btn-large",
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                inputEvent: true,
            },

            "quqi.com": {
                // 曲奇云
                inputSelector: "div.webix_el_box>input",
                buttonSelector: "button.webixtype_base",
                regStr: "[a-z\\d]{6}",
                timeout: 800,
            },

            "caiyun.139.com": {
                // 和彩云
                inputSelector: "input",
                buttonSelector: "a.btn-token",
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                inputEvent: true,
                store: true,
            },

            "mo.own-cloud.cn": {
                // 小麦魔方
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d]{4,8}",
                timeout: 500,
                store: true,
                react: true,
            },

            "cloud.qingstore.cn": {
                // 清玖云
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                store: true,
                react: true,
            },

            "pan.mebk.org": {
                // 马恩资料库云盘
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d]{6}",
                timeout: 500,
                store: true,
                react: true,
            },

            "pan.bilnn.com": {
                // 比邻云盘
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d]{6}",
                timeout: 500,
                store: true,
                react: true,
            },

            "mega.nz": {
                regExp: /^[a-z\d\-_]{22}$/i,
            },
        },

        mapHost(host) {
            return host
                .replace(/.*lanzou[isx]?.com/, "lanzou.com")
                .replace(/quqi\.\w+\.com/, "quqi.com");
        },

        autoFill(host) {
            let site = this.sites[host];
            if (site.timeout) setTimeout(fillOnce, site.timeout);
            else fillOnce();
            function fillOnce() {
                if (site.inputSelector) {
                    let input = $(site.inputSelector),
                        button = $(site.buttonSelector),
                        code = null;
                    if (input.length) {
                        if (site.store) code = t.get(host);
                        else code = t.hashcode();
                        if (code) {
                            let codeRe = RegExp("^" + site.regStr + "$", "i");
                            if (codeRe.test(code)) {
                                if (site.inputEvent) {
                                    let tid = setInterval(() => {
                                        input.val(code);
                                        if (input.val() !== "") {
                                            if (InputEvent) {
                                                input[0].dispatchEvent(
                                                    new InputEvent("input")
                                                );
                                            } else if (KeyboardEvent) {
                                                input[0].dispatchEvent(
                                                    new KeyboardEvent("input")
                                                );
                                            }

                                            clearInterval(tid);
                                            button.click();
                                        }
                                    }, 1000);
                                } else if (site.react) {
                                    let lastValue = input.val();
                                    input.val(code);
                                    let tracker = input[0]._valueTracker;
                                    if (tracker) tracker.setValue(lastValue);
                                    input.trigger("input");
                                    button.click();
                                } else {
                                    input.val(code);
                                    if (site.clickTimeout)
                                        setTimeout(() => {
                                            button[0].click();
                                        }, site.clickTimeout);
                                    else button[0].click();
                                }
                                success_times = +t.get("success_times") + 1;
                                t.set("success_times", success_times);
                            } else {
                                t.clog("未找到合适的提取码!");
                            }
                        } else {
                            t.clog("未找到提取码!");
                        }
                    } else {
                        t.clog("无需填写密码!");
                    }
                }
            }
        },

        addCode(a) {
            let mapped = this.mapHost(a.host),
                site = this.sites[mapped],
                codeRe = new RegExp("^" + site.regStr + "$", "i");
            if (!codeRe.test(a.hash.slice(1))) {
                let reg = new RegExp(
                        "\\s*(?:提[取示]|访问|查阅|密\\s*|艾|Extracted-code|key|password|pwd)[码碼]?\\s*[:： （(]?\\s*(" +
                            site.regStr +
                            ")|^\\s*[:：【\\[ （(]?\\s*(" +
                            site.regStr +
                            ")[】\\]]?$",
                        "i"
                    ),
                    code = reg.exec($(a).text());
                for (
                    let i = 10, current = a;
                    !code && i > 0;
                    i--, current = current.parentElement
                ) {
                    let next = current;
                    while (!code) {
                        next = next.nextSibling;
                        if (!next || next.href) break;
                        else code = reg.exec($(next).text());
                    }
                }

                if (code) {
                    let c = code[1] || code[2];
                    if (site.store) t.set(mapped, c);
                    else if (locHost.includes("zhihu.com")) {
                        let span = $("<span class='invisible'></span>");
                        span.text("#" + c);
                        $(a).append(span);
                    } else a.hash = c;
                } else {
                    if (site.store) t.delete(mapped);
                    t.clog("找不到code!");
                }
            }
        },
    };
    let success_times = t.get("success_times");
    if (!success_times) t.set("success_times", 0);
    
    let dealedHost = YunDisk.mapHost(locHost);
    if (YunDisk.sites[dealedHost]) YunDisk.autoFill(dealedHost);
    else {
        let RedirectPage = {
            sites: {
                "show.bookmarkearth.com": {
                    // 书签地球
                    include: "http://show.bookmarkearth.com/view/",
                    selector: "a.open-in-new-window",
                },

                "t.cn": {
                    // 微博
                    include: "http://t.cn/",
                    selector: "a.m-btn-orange",
                },

                "sunbox.cc": {
                    // 阳光盒子
                    include:
                        "https://sunbox.cc/wp-content/themes/begin/go.php?url=",
                    selector: "a.alert-btn",
                },

                "www.itdaan.com": {
                    // 开发者知识库
                    include: "https://www.itdaan.com/link/",
                    selector: "a.c-footer-a1",
                },

                "to.redircdn.com": {
                    include:
                        "https://to.redircdn.com/?action=image&url=",
                    selector: "a.bglink",
                },
                
                "link.csdn.net": {
                    include: "https://link.csdn.net/?target=",
                    selector: "a.loading-btn",
                    timeout: 50,
                }
            },

            redirect(host) {
                let site = this.sites[host];
                if (locHref.includes(site.include)) {
                    if (site.timeout) setTimeout(redirect, site.timeout);
                    else redirect();
                    
                    function redirect() {
                        let target = $(site.selector);
                        if (target.length) location.replace(target[0].href);
                        success_times = +t.get("success_times") + 1;
                                t.set("success_times", success_times);
                    }
                }
            },

            wiki() {
                let isZh = locHost.includes("zh"),
                    jumpToZh = t.get("jumpToZh", true),
                    a = $("a.interlanguage-link-target[lang='zh']");

                if (!isZh && jumpToZh) {
                    history.pushState(null, null, locHref);
                    if (a.length) location.replace(a[0].href);
                    else t.showNotice("没有找到中文页面!");
                }

                let menuID = t.registerMenu(
                    `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                    autoJump
                );

                function autoJump() {
                    jumpToZh = !jumpToZh;
                    t.set("jumpToZh", jumpToZh);
                    t.unregisterMenu(menuID);
                    menuID = t.registerMenu(
                        `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                        autoJump
                    );
                    if (!isZh && jumpToZh) {
                        if (a.length) location.replace(a[0].href);
                        else t.showNotice("没有找到中文页面!");
                    } else history.back();
                }
            },

            mozilla() {
                let isZh = locPath.includes("zh-CN"),
                    jumpToZh = t.get("jumpToZh", true);
                jump();
                function jump() {
                    if (!isZh && jumpToZh) {
                        let result = /developer\.mozilla\.org\/(.+?)\//.exec(
                            locHref
                        );
                        t.clog(result);
                        if (result) {
                            let zh_url = locHref.replace(result[1], "zh-CN");
                            history.pushState(null, null, locHref);
                            location.replace(zh_url);
                        }
                    }
                }
                let menuID = t.registerMenu(
                    `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                    autoJump
                );

                function autoJump() {
                    jumpToZh = !jumpToZh;
                    t.set("jumpToZh", jumpToZh);
                    t.unregisterMenu(menuID);
                    menuID = t.registerMenu(
                        `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                        autoJump
                    );
                    jump();
                }
            },
        };

        if (RedirectPage.sites[locHost]) RedirectPage.redirect(locHost);
        else if (locHost.match(/.+wiki(?:\.sxisa|pedia)\.org/))
            RedirectPage.wiki();
        else {
            if (locHost === "developer.mozilla.org") RedirectPage.mozilla();

            $(document).on("mouseup", function (obj) {
                let e = obj.originalEvent.explicitOriginalTarget || obj.target,
                    isTextToLink = false;
                // t.clog(obj);
                if (e && !e.href) {
                    let flag = true,
                        selectNode = null;
                    for (
                        let current = e, limit = 5;
                        current.localName !== "body" && limit > 0;
                        current = current.parentElement, limit--
                    ) {
                        if (current.localName === "a") {
                            e = current;
                            break;
                        } else if (
                            ["code", "pre"].some(
                                (tag) => tag === current.localName
                            )
                        ) {
                            let selection = getSelection(),
                                text = selection.toString();
                            if (url_regexp.test(text))
                                selectNode =
                                    selection.anchorNode || selection.focusNode;
                            else flag = false;
                            break;
                        }
                    }

                    if (e.localName !== "a" && flag) {
                        let node = 
                            selectNode ||
                            obj.originalEvent.explicitOriginalTarget;
                        if (node && node.nodeValue) e = text2Link(node);
                        else e = textToLink(e);
                        if (e) 
                            isTextToLink = true;
                    }
                }

                if (e && e.localName === "a") {
                    let a = e;
                    if (locHref.includes("mod.3dmgame.com/mod/"))
                        a.search = "3dmgame.com";
                    if (isLinkText(a)) {
                        if (url_regexp.test(a.innerText)) 
                            a.href = t.http(a.innerText, true);
                    }

                    cleanRedirectLink(a);

                    if (a.host.includes("wikipedia.org")) {
                        // 维基百科
                        a.href = a.href.replace(
                            "wikipedia.org",
                            "wiki.sxisa.org"
                        );
                    } else if (a.host.includes("developers.google.com")) {
                        // 谷歌开发者
                        a.href = a.href.replace(
                            "developers.google.com",
                            "developers.google.cn"
                        );
                    } else if (YunDisk.sites[YunDisk.mapHost(a.host)]) {
                        // 网盘
                        YunDisk.addCode(a);
                        if (isTextToLink) a.click();
                    }

                    add_blank(a);
                }
            });

            let textLength = t.get("textLength", 200);

            // let menuID = t.registerMenu(
            //     `设置文本字数限制(${textLength})`,
            //     limitText
            // );

            // function limitText() {
            //     let input = prompt(
            //         "请输入文本字数限制: ",
            //         t.get("textLength", 200)
            //     );
            // }
            let url_regexp_g = new RegExp(
                        "\\b(" +
                            "(\\w(?:[\\w._-])+@\\w[\\w\\._-]+\\.(?:com|cn|org|net|info|tv|cc|gov|edu)|(?:https?:\\/\\/|www\\.)[\\w_\\-\\.~\\/\\=\\?&#]+|(?:\\w[\\w._-]+\\.(?:com|cn|org|net|info|tv|cc|gov|edu))(?:\\/[\\w_\\-\\.~\\/\\=\\?&#]*)?)" +
                            "|" +
                            "ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/" + 
                            "|" +
                            "magnet:\\?xt=urn:btih:\\w{40}(&[\\w\\s]+)?" +
                            ")",
                        "ig"
                    );
            
            function textToLink(e) {
                if (
                    !["body", "code", "pre"].some(
                        (tag) => tag === e.localName
                    ) &&
                    !["www.google"].some((h) => locHost.includes(h))
                ) {
                    let span = null,
                        count = 0;
                    for (
                        let i = e.childNodes.length - 1, limit = 20;
                        i >= 0 && limit > 0;
                        i--
                    ) {
                        let child = e.childNodes[i];
                        if (
                            !["a", "br", "code", "pre", "img", "script"].some(
                                (tag) => tag === child.localName
                            ) && 
                            child.className !== "textToLink" &&
                            child.textContent.length < textLength
                        ) {
                            let text = t.clean(child.textContent, "防和谐"), result = url_regexp_g.test(text);
                            if (result) {
                                span = $("<span class='textToLink'></span>");
                                span.html(
                                    text.replace(url_regexp_g, function ($1) {
                                        count++;
                                        if ($1.includes("@")) return `<a href="mailto:${$1}">${$1}</a>`;
                                        return $1.startsWith("http") ||
                                            $1.includes("magnet") ||
                                            $1.includes("ed2k")
                                            ? `<a href="${$1}" target="_blank">${$1}</a>`
                                            : `<a href="https://${$1}" target="_blank">${$1}</a>`;
                                    })
                                );
                                $(child).replaceWith(span);
                            }
                            limit--;
                        }
                    }
                    if (count) {
                        success_times = +t.get("success_times") + 1;
                        t.set("success_times", success_times);
                    }
                    return count == 1 && span && span.children()[0];
                }
            }

            function text2Link(node) {
                if (node.nodeValue.length < textLength) {
                    let text = t.clean(node.nodeValue, "防和谐"), result = url_regexp_g.test(text),
                        span = null,
                        count = 0;
                    if (result) {
                        span = $("<span class='text2Link'></span>");
                        span.html(
                            text.replace(url_regexp_g, function ($1) {
                                    count++;
                                    if ($1.includes("@")) return `<a href="mailto:${$1}">${$1}</a>`;
                                    return $1.startsWith("http") ||
                                        $1.includes("magnet") ||
                                        $1.includes("ed2k")
                                        ? `<a href="${$1}" target="_blank">${$1}</a>`
                                        : `<a href="https://${$1}" target="_blank">${$1}</a>`;
                                })
                        );
                        $(node).replaceWith(span);
                    }
                    if (count) {
                        success_times = +t.get("success_times") + 1;
                        t.set("success_times", success_times);
                    }
                    return count == 1 && span && span.children()[0];
                }
            }

            function isLinkText(a) {
                let keywords = [
                    "www.sunweihu.com/go/?url=",
                    "jump.bdimg.com/safecheck/index?url=",
                    "jump2.bdimg.com/safecheck/index?url=",
                    "zhouxiaoben.info/wp-content/themes/begin/go.php?url=",
                    "https://to.redircdn.com/?",
                    "www.423down.com/wp-content/plugins/momgo/go.php?url="
                ];
                return keywords.some((k) => a.href.includes(k));
            }

            let excludeSites = t.get("excludeSites", [
                "v.qq.com",
                "v.youku.com",
                "blog.csdn.net",
                "cloud.tencent.com",
                "translate.google.com",
                "domains.live.com",
                "passport.yandex.ru",
                "www.iconfont.cn",
                "baike.sogou.com",
                "www.kdocs.cn",
                "help.aliyun.com",
                "cn.bing.com",
                "service.weibo.com",
                "zhannei.baidu.com",
                "pc.woozooo.com",
            ]);

            t.registerMenu("添加例外域名", addExcludeSite);

            // 添加例外域名
            function addExcludeSite() {
                let input = prompt("输入的域名下的链接不会被净化: ", locHost);
                if (input) {
                    if (/[\w]+(\.[\w]+)+/.test(input)) {
                        if (!excludeSites.some((s) => s.includes(input))) {
                            excludeSites.push(input);
                            t.set("excludeSites", excludeSites);
                        } else t.showNotice(`例外域名 <${input}> 已存在!!!`);
                    } else t.showNotice(`<${input}> 不是有效域名!!!`);
                }
            }

            function cleanRedirectLink(a) {
                // 净化跳转链接
                let reg = /((?:http|https|\/|\%2F).*?\?|.*?\?.+?=)((?:http|\/|\%2F).+|([\w]+(?:(?:\.|%2E)[\w]+)+))/,
                    result = reg.exec(a.href);
                if (result) {
                    let temp = decodeURIComponent(
                        decodeURIComponent(result[2])
                    );
                    if (
                        !(
                            decodeURIComponent(location.href).includes(
                                temp.split("&")[0]
                            ) ||
                            (result[3] && result[3].includes(location.host)) ||
                            excludeSites.some((s) => result[1].includes(s)) ||
                            YunDisk.sites[YunDisk.mapHost(a.host)]
                        )
                    ) {
                        let href = decodeURIComponent(
                            decodeURIComponent(
                                result[3]
                                    ? "http://" + result[3]
                                    : result[2].startsWith("http")
                                    ? result[2]
                                    : location.origin + result[2]
                            )
                        );
                        if (a.title)
                            a.title += "\n" + decodeURIComponent(a.href);
                        else a.title = decodeURIComponent(a.href);
                        if (["c.pc.qq.com","mail.qq.com"].some((h) => a.host == h))
                            a.href = href.split("&")[0];
                        else a.href = href;
                        success_times = +t.get("success_times") + 1;
                        t.set("success_times", success_times);
                    }
                }
            }

            let defaultTargetSites = t.get("defaultTargetSites", []);
            let isAddBlank = t.get("isAddBlank", false);
            let isDefault = defaultTargetSites.some((s) => s == location.host);
            // 注册菜单项该站链接保持默认打开方式
            if (!isDefault) {
                let menuID2 = t.registerMenu(
                    "该站链接保持默认打开方式",
                    function () {
                        defaultTargetSites.push(location.host);
                        t.set("defaultTargetSites", defaultTargetSites);
                        isDefault = defaultTargetSites.some(
                            (s) => s == location.host
                        );
                        t.unregisterMenu(menuID2);
                        t.unregisterMenu(menuID);
                    }
                );

                // 注册菜单项启停在新标签打开链接
                let menuID = t.registerMenu(
                    `${isAddBlank ? "[✔]" : "[✖]"}在新标签打开链接`,
                    addBlank
                );

                // 启停在新标签打开链接
                function addBlank() {
                    isAddBlank = !isAddBlank;
                    t.set("isAddBlank", isAddBlank);
                    t.unregisterMenu(menuID);
                    menuID = t.registerMenu(
                        `${isAddBlank ? "[✔]" : "[✖]"}在新标签打开链接`,
                        addBlank
                    );
                }
            }

            // 给链接添加[target="_blank"]属性
            function add_blank(a) {
                if (isAddBlank && !isDefault) {
                    let result =
                            a.target == "_blank" ||
                            /javascript[\w:;()]+/.test(a.href) ||
                            /\/\w+-\d+-\d+\.html|.+page\/\d+|category-\d+_?\d*/.test(
                                a.href
                            ) ||
                            /[前后上下首末].+[页篇张]|^\.*\s*\d+\s*\.*$|^next$|^previous$/i.test(
                                a.innerText
                            ) ||
                            ["prev", "next"].some(
                                (r) =>
                                    r == a.attributes.rel &&
                                    a.attributes.rel.nodeValue
                            ) ||
                            ["prev", "next", "nxt"].some((r) =>
                                a.className.includes(r)
                            ) ||
                            a.href == location.origin + "/" ||
                            a.href.endsWith(".user.js"),
                        relative = t.get("relative", false);
                    if (!relative)
                        result =
                            result ||
                            !/^(?:http|\/\/).+/.test(
                                a.attributes.href.nodeValue
                            );
                    if (!result) a.target = "_blank";
                }
            }
        }
    }
});
