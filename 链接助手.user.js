// ==UserScript==
// @name            链接助手
// @namespace       https://github.com/oneNorth7
// @include         *
// @version         2.0.2
// @author          一个北七
// @run-at          document-body
// @description     支持全网主流网盘和小众网盘自动填写密码; 资源站点下载页网盘密码预处理; 文本转链接; 移除链接重定向; 重定向页面自动跳转; 维基百科及镜像、开发者文档、谷歌商店自动切换中文, 维基百科、谷歌开发者、谷歌商店、Github链接转为镜像链接; 新标签打开链接; (外部)链接净化直达
// @icon            https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png
// @compatible      chrome 69+
// @compatible      firefox 78+
// @compatible      edge Latest
// @noframes
// @license           GPL-3.0 License
// @exclude         *://www.kdocs.cn/p/*
// @exclude         *://docs.google.com/document/d/*
// @exclude         *://www.notion.so/*
// @exclude         *://www.wolai.com/*
// @exclude         *://yiqixie.qingque.cn/d/home/*
// @exclude         *://www.yuque.com/*/edit
// @exclude         *://*.cqaso.com/*
// @exclude         *://xiezuocat.com/#/doc/*
// @exclude         *://mail.*
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @grant              GM_notification
// @grant              GM_info
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_deleteValue
// @grant              GM_openInTab
// @grant              GM_addStyle
// @require          https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require          https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
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
        
        clog() {
            console.group("[链接助手]");
            if (locHost === "cloud.189.cn" || locHost === "pan.xunlei.com")
                console.log = console.dir;

            for (let m of arguments) {
                if (void 0 !== m) console.log(m);
            }
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
        
        open(url, options = { active: true, insert: true, setParent :true }) {
            GM_openInTab(url, options);
        },

        http(link, s = false) {
            return link.startsWith("http")
                ? link
                : (s ? "https://" : "http://") + link;
        },
        
        title(a, mark="") {
            if (a.title)
                a.title += "\n" + mark + decodeURIComponent(a.href);
            else a.title = mark + decodeURIComponent(a.href);
        },
        
        hashcode(l=location) {
            return l.hash.slice(1);
        },
        
        search(l=location, p = "password") {
            let args = l.search.slice(1).split("&");
            for (let a of args) {
                if (a.includes(p + "="))
                    return a.replace(p + "=", "");
            }
            return "";
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
        
        confirm(title, yes, no = () => {}, deny = false) {
            let option = {
                        toast: true,
                        showCancelButton: true,
                        position: "center",
                        title,
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        showDenyButton: deny,
                        denyButtonText: "取消",
                        customClass: {
                            popup: "lh-popup",
                            content: "lh-content",
                            closeButton: "lh-close"
                        },
                    };
            return Swal.fire(option).then((res) => {
                if (res.isConfirmed) yes();
                else if (res.isDismissed) no();
                else if (res.isDenied) deny();
            });
        },
        
        increase() {
            success_times = +this.get("success_times") + 1;
            this.set("success_times", success_times);
        },

        subscribe() {
            let isFollowed = t.get("isFollowed", false), least_times = t.get("least_times", 30);
            success_times = +this.get("success_times");
            if (success_times > least_times && !isFollowed) {
                Swal.fire({
                          title: '\u5173\u6ce8\u516c\u4f17\u53f7\uff0c\u4e0d\u8ff7\u8def\uff01',
                          html: $(
                        `<div><img style="width: 300px;margin: 5px auto;" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png"><p style="font-size: 16px;color: red;">\u7b2c\u4e00\u65f6\u95f4\u83b7\u53d6<span style="color: gray;font-weight: 700;">\u3010\u94fe\u63a5\u52a9\u624b\u3011</span>\u66f4\u65b0\u63a8\u9001\uff01</p></div>`
                    )[0],
                          showCancelButton: true,
                          allowOutsideClick: false,
                          confirmButtonColor: "#d33",
                          confirmButtonText: "\u5df2\u5173\u6ce8\uff0c\u4e0d\u518d\u63d0\u9192\uff01",
                          cancelButtonColor: "#3085d6",
                          cancelButtonText: "\u7a0d\u540e\u5173\u6ce8",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              position: "center",
                              icon: "success",
                              title: "\u611f\u8c22\u5173\u6ce8\uff01\uff01\uff01",
                              text: "\u4e00\u4e2a\u5317\u4e03\u4f1a\u7ee7\u7eed\u4e0d\u9057\u4f59\u529b\u5730\u521b\u4f5c\u66f4\u591a\u5b9e\u7528\u5de5\u5177",
                              showConfirmButton: false,
                              timer: 2000
                            });
                            t.set("isFollowed", true);
                          } else t.set("least_times", least_times + 30);
                        });
            }
        },

        update(name, value) {
            if (this.get("updated_version", "") != scriptInfo.version) {
                let data = this.get(name, false);
                if (data) {
                    value.push("uniportal.huawei.com", "cn.bing.com");
                    let temp = data.filter(h => !value.includes(h));
                    if (temp.length) 
                        this.set(name, temp);
                }

                this.rename("excludeSites", "excludeHosts");
                this.rename("autoClickSites", "autoClickHosts");
                this.set("updated_version", scriptInfo.version);
            }
        },

        rename(name, newName) {
            if (this.get("updated_version", "") != scriptInfo.version) {
                let data = this.get(name, false);
                if (data) {
                    this.set(newName, data);
                    this.delete(name);
                }
            }
        },
        
        rand(min, max) {
            if (arguments.length == 1) max = min, min = 0;
            let random = Math.random(),
                randInt = Math.floor(random * (max + 1 - min)) + min;
            return randInt;
        },
    };

    let host_suffix = "(?:com|cn|org|net|info|tv|cc|gov|edu|nz|me|io|ke|im|top|xyz|app|moe|in|pw|one|co|ml|art|vip|cam|fun)\\b",
        http_re_str = "(?:https?:\\/\\/|www\\.)[-\\w_.~/=?&#%+:!*@]+|(?<!@)(?:\\w[-\\w._]*\\." + host_suffix + ")(?:\\/[-\\w_.~/=?&#%+:!*@\\u4e00-\\u9fa5]*)?",
        bdpan_re_str = "(?:\\/?s)?\\/[-\\w_]{23}|(?:\\/?s)?\\/\\w{6,8}",
        email_re_str = "(?<![.@])\\w(?:[-\\w._])+@\\w[-\\w._]+\\." + host_suffix,
        ed2k_re_str = "ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/",
        magnet_re_str = "(magnet:\\?xt=urn:btih:(?:[a-fA-F0-9]{40}|[a-zA-Z2-7]{32})|(?<![|/?#=])\\b(?:[a-f0-9]{40}|[A-F0-9]{40}|[a-z2-7]{32}|[A-Z2-7]{32})\\b)",
        magnet_suffix = "(?:&[\\S]+)?",
        base64_re_str = "(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)",
        thunder_re_str = "thunder:\\/\\/" + base64_re_str,
        url_regexp = new RegExp("\\b" + ed2k_re_str +
                            "|" + email_re_str +
                            "|" + http_re_str +
                            "|" + thunder_re_str +
                            (locHost === "tieba.baidu.com" ? ("|" + bdpan_re_str ) : "") +
                            "|" + magnet_re_str + magnet_suffix
                            , "i");
    
    let Preprocess = {
        "www.mikuclub.cc": function () {
            if (/\/\d+/.test(locPath)) {
                let password = $(".password1"),
                    link = $("a.download");
                if (password.length && link.length)
                    link[0].hash = password[0].value;
            }
        },

        "www.olecn.com": function () {
            if (/http:\/\/www\.olecn\.com\/download\.php\?id=\d+/.test(locHref)) {
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
            if (/\/(?:pcrj\/|Android\/\d+\.html)/.test(locPath)) {
                let filetit = $("div.filetit:first");
                for (let child of filetit.children()) {
                    if (child.href) {
                        let result = child.innerHTML.match(http_re_str);
                        if (result) child.href = t.http(result[0]);
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

        "www.appmiu.com": function () {
            if (/https:\/\/www\.appmiu\.com\/download\/\?post_id=/.test(locHref)) {
                setTimeout(() => {
                    let code = $("#tq").attr("data-clipboard-text");
                    if (code) {
                        let a = $("a.empty.button"), url = a.prop("href");
                        if (url) a.prop("href", url + "#" + code);
                    }
                }, 1000);
            }
        },

        "www.acgjc.com": function () {
            if (/http:\/\/www.acgjc.com\/storage-download\/\?code=/.test(locHref)) {
                let codeNode = $("#theme_custom_storage-0-download-pwd");
                if (codeNode.length) {
                    let code = codeNode.val(),
                        link = codeNode.parents("div.fieldset-content").find("a");
                    if (link) link.prop("href", link[0].href + "#" + code);
                }
            }
        },
        
        "www.bsh.me": function () {
            if (/https:\/\/www\.bsh\.me\/download\.php\?author=/.test(locHref)) {
                $('ul.list-group:last').find('a').each((i, a) => {
                    let text = $(a).text(),
                        codeNode = $(a).parents('ul.list-group').find(`span.item-title:contains("${text}"):last`),
                        result = /\w{2,10}/.exec(codeNode.text());

                    if (a.search === "?%3E") a.search = "";
                    
                    if (result) a.hash = result[0];
                    else a.hash = codeNode.parent().text().match("\\w{2,10}")[0];
                });
                
                $(".card div.text-center, footer.blockquote-footer").hide();
                $("div.card-signup").css("margin-bottom", "20px");
            }
        },

        "www.yxssp.com": function () {
            if (/https:\/\/www\.yxssp\.com\/download\.php\?author=/.test(locHref)) {
                $("ul.list-group:last").find("a").each((i, a) => {
                    let text = $(a).text(),
                        codeNode = $(a).parents("ul.list-group").find(`span.item-title:contains("${text}"):last`);

                    if (codeNode[0].nextSibling) codeNode = codeNode[0].nextSibling;
                    let result = /[.\w]{2,13}/.exec($(codeNode).text());

                    if (a.search === "?%3E") a.search = "";
                    
                    if (result) a.hash = result[0];
                });
                
                $(".card div.text-center, footer.blockquote-footer").hide();
                $("div.card-signup").css("margin-bottom", "20px");
            }
        },
        
        "www.zhiruanku.com": function () {
            if (/\/\d+/.test(locPath)) {
                $("div.wp-block-zibllblock-buttons a").each((i, a) => {
                    a.href = a.dataset.id
                    let result = a.textContent.match(":(\\w{2,10})");
                    if (result) a.hash = result[1];
                });
            }
        },
        
        "zhidao.baidu.com": function () {
            if (/\/question\/\d+\.html.*/.test(locPath)) {
                $("baiduyun.ikqb-yun-box").each((i, e) => {
                    let title = $(e).attr("data_title"),
                        url = $(e).attr("data_sharelink") + "#" + $(e).attr("data_code"),
                        p = $(e).parent("p");
                    p.before(`<p style="font-size:24px"><a href="${url}" title="点我可自动填写密码！" target="_blank"><span style="color:#36BE63">预处理链接：</span>${title}</a></p>`);
                });
            }
        },
        
        "yun.hei521.cn": function () {
            if (/\/index\.php\/archives\/\d+\.html/.test(locPath)) {
                let text = $("ol.comment-list .zface-box p:contains('码')").text();
                if (!addCode(text)) {
                    text = $("div.post-content p:contains('码')").text();
                    addCode(text);
                }
            }
            
            function addCode(text) {
                if (text) {
                    let codes = text.match(/码[:：]\s*[a-z\d]{4}/g);
                    if (codes) {
                        $("div.post-content a:contains('http')").each((i, a) => {
                            let result = a.nextSibling && a.nextSibling.nodeValue && a.nextSibling.nodeValue.match(/[a-z\d]{4}/);
                            if (result) a.hash = "#" + result[0];
                            else if (codes[i]) a.hash = "#" + codes[i].replace(/码[:：]\s*/, "");
                        });
                        return true;
                    } 
                }
            }
        },

        "www.iapps.me": function () {
            if (/\?download=\d+/.test(location.search)) {
                let code = $("div.alert").text().match(/[a-z\d]{4}/g);
                if (code)
                    $("button.download-btn").attr("data-href", $("button.download-btn").attr("data-href") + "#" + code[0]);
                
                $("#carouselAdIndicators").parent().remove();
            }
            
            if (/\/archives\/\d+/.test(locPath)) {
                let func = $("#directDownload_2 .btn-primary").prop("onclick");
                if (func) {
                    let funcStr = func.toString(),
                        result = funcStr.match(/open\("(.+)"\)/);
                    if (result) $("div.getit>a").prop("href", result[1]).click(o => o.stopImmediatePropagation());
                }
            }
        },

        "www.sxpdf.com": function() {
            if (locHref.startsWith("https://www.sxpdf.com/wp-content/themes/niao/down.php?id="))
                $('a[onclick="copyUrl2()"]').removeAttr("onclick");
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
                redirect: { pathname: {"/wap/": "/share/"} },
            },

            "eyun.baidu.com": {
                // 百度企业网盘
                inputSelector: "input.share-access-code",
                buttonSelector: "a.g-button",
                regStr: "[a-z\\d]{4,6}",
            },

            "cloud.189.cn": {
                // 天翼云
                inputSelector: "#code_txt",
                buttonSelector: "a.btn-primary",
                regStr: "[a-z\\d]{4}",
                timeout: 1000,
                inputEvent: true,
                noNotice: true,
                checkError: true,
            },
            
            "h5.cloud.189.cn": {
                // 手机天翼云
                inputSelector: "input.access-code-input",
                buttonSelector: "div.button",
                regStr: "[a-z\\d]{4}",
                timeout: 100,
                password: true,
                inputEvent: true,
                redirect: { href: {"h5.cloud.189.cn/share.html#/t/": "cloud.189.cn/web/share?code="} },
            },

            "lanzou.com": {
                // 蓝奏云
                inputSelector: "#pwd",
                buttonSelector: "#sub, .passwddiv-btn",
                regStr: "[a-z\\d]{2,10}|-{4}",
                redirect: { host: { "lanzous": "lanzoux" } },
                noNotice: true,
            },

            "ctfile.com": {
                // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 500,
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
                timeout: 1200,
                password: true,
                searchPath: true,
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
                password: true,
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
                timeout: 100,
                clickTimeout: 10,
                inputEvent: true,
                store: true,
            },

            "mo.own-cloud.cn": {
                // 小麦魔方
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d\\u4e00-\\u9fa5]{2,8}",
                timeout: 500,
                password: true,
                cleanHash: true,
            },

            "moecloud.cn": {
                // 萌云
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "\\w+\\.\\w+\\.\\w+|[a-z\\d]{3,8}",
                timeout: 500,
                password: true,
                cleanHash: true,
                redirect: { host: {"cloud.qingstore.cn": "moecloud.cn"} },
            },
            
            "www.wenshushu.cn": {
                // 文叔叔
                inputSelector: "input.ivu-input",
                buttonSelector: "button.m-mg_t40",
                regStr: "[a-z\\d]{4,8}",
                timeout: 1000,
                inputEvent: true,
            },
            
            "mega.nz": {
                // regStr: "[a-z\\d\\-_]{22}",
            },
            
            "www.jianguoyun.com": {
                // 坚果云
                inputSelector: "#access-pwd",
                buttonSelector: "button.action-button",
                regStr: "[a-z\\d]{4,16}",
            },
            
            "yunpan.360.cn": {
                // 360安全云盘
                inputSelector: "input.pwd-input",
                buttonSelector: "input.submit-btn",
                regStr: "[a-z\\d]{4}",
            },
            
            "pan-yz.chaoxing.com": {
                // 超星云盘
                inputSelector: "input.tqInp",
                buttonSelector: "a.blueBgBtn",
                regStr: "[a-z\\d]{6}",
            },
            
            "shandianpan.com": {
                // 闪电盘
                inputSelector: 'input[placeholder="请输入文件密码"]',
                buttonSelector: "div.btn",
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                password: true,
                inputEvent: true,
                pathHash: true,
            },
            
            "my.sharepoint.com": {
                // SharePoint
                inputSelector: '#txtPassword',
                buttonSelector: "#btnSubmitPassword",
                regStr: "[a-z\\d]{3,5}",
                password: true,
            },

            "onedrive.live.com": {
                // OneDrive
                inputSelector: 'input[type="password"]',
                buttonSelector: "button.od-Button--primary",
                regStr: "[a-z\\d]{3,7}",
                store: true,
                inputEvent: true,
                timeout: 5000,
            },
            
            "u.163.com": {
                // 网易网盘
                inputSelector: "#pickupCode",
                buttonSelector: "#wpDownloadHref",
                regStr: "[a-z\\d]{8}",
            },
            
            "www.aliyundrive.com": {
                // 阿里云盘
                inputSelector: "input.ant-input",
                buttonSelector: "button.button--fep7l",
                regStr: "[a-z\\d]{4}",
                timeout: 1000,
                react: true,
            },

            "cowtransfer.com": {
                // 奶牛快传
                inputSelector: "div.receive-code-input input",
                buttonSelector: "div.button.open-buttom",
                regStr: "[a-z\\d]{6}",
                timeout: 500,
                inputEvent: true,
                reverse: true,
                hidden: true,
            },

            "www.123pan.com": {
                // 123云盘
                inputSelector: "input.ant-input",
                buttonSelector: "input.ant-input+button",
                regStr: "[a-z\\d]{4,8}",
                timeout: 1000,
                react: true,
            },
        },
        
        pans: [
            "disk.yandex.com", // YandexDisk
            "yadi.sk", // YandexDisk
            "www.mediafire.com", // MediaFire     
            "drive.google.com", // GoogleDrive
            "down.52pojie.cn", // 爱盘
            "www.yunzhongzhuan.com", // 云中转
            "yiqixie.qingque.cn", // 一起写
            "www.androiddownload.net",
            "www.dropbox.com", // Dropbox
            "www.kufile.net", // 库云
            "www.kdocs.cn", // 金山文档
            "pan.bitqiu.com", // 比特球云盘
            "www.feimaoyun.com", // 飞猫云
            "www.fmpan.com",  // 飞猫云
            "www.fangcloud.com", // 亿方云
            "gd.188988.xyz", // GD DISK
            "www.yun.cn", // UC网盘
            "www.yuque.com", // 语雀
            "shimo.im", // 石墨文档
            "www.showdoc.com.cn", // ShowDoc
            "zijieyunpan.com", // 字节网盘
        ],

        mapHost(host) {
            let dict = {
                "^yun\\.baidu\\.com": "pan.baidu.com",
                ".*lanzou[iswx]?\\.com": "lanzou.com",
                "^(?:[a-z]\\d{3}|\\d{3}[a-z]|t00y|\\w+\\.(?:ctfile|pipipan))\\.com$|^ctfile\\.\\w+\\.cn$": "ctfile.com",
                "^ct\\.\\w+\\.(?:com|me|org)$": "ctfile.com",
                "quqi\\.\\w+\\.com": "quqi.com",
                "\\w+\\-my\\.sharepoint\\.(?:com|cn)": "my.sharepoint.com",
                "\\w{6}\\.link\\.yunpan\\.360\\.cn|yunpan\\.cn": "yunpan.360.cn",
            };
            
            for (let key in dict)
                if (host.match(key))
                    return host.replace(host, dict[key]);

            if (t.get("ctpanHosts", []).concat(["dl.sixyin.com", "dw.yxssp.com", "down.sxpdf.com", "dl.ooopn.com", "pd.ggtrj.com", "72k.us", "u.yfxj91.top"]).includes(host))
                return host.replace(host, "ctfile.com");
            if (t.get("cloudreveHosts", []).concat(["cloud.qingstore.cn", "cncncloud.com", "ilolita945.softether.net:5212", "my-file.cn",
                      "pan.bilnn.com", "drive.dnxshare.cn", "pan.mba", "pan.oddba.cn", "pan.adycloud.com", "pan.yrxitong.com", "disk.onji.cn", "www.naikuai.cn"]).includes(host))
                return host.replace(host, "moecloud.cn");

            let mapped = {
                "feixin.10086.cn": "139.com",
                "ws28.cn": "www.wenshushu.cn",
                "wss1.cn": "www.wenshushu.cn",
                "zb.my.to:5000": "gofile.me",
                "cloud.dnxshare.cn": "drive.dnxshare.cn",
                "mofile.own-cloud.cn": "mo.own-cloud.cn",
                "nf.mail.163.com": "u.163.com",
                "1drv.ms": "onedrive.live.com",
                "alywp.net": "www.aliyundrive.com",
                "app.mediatrack.cn": "mdl.ink",
            }[host];
            if (mapped)
                return host.replace(host, mapped);
            
            return host;
        },

        redirect(a, d) {
            if (d) {
                for (let k in d) {
                    for (let v in d[k])
                        a[k] = a[k].replace(v, d[k][v]);
                }
            }
        },

        autoFill(host) {
            let site = this.sites[host];
            // 百度云文档
            if (host === "pan.baidu.com" && locPath.startsWith("/doc/share/"))
                site = {
                    inputSelector: "input.u-input__inner",
                    buttonSelector: "div.dialog-footer button.u-btn.u-btn--primary",
                    regStr: "[a-z\\d]{4}",
                    inputEvent: true,
                    timeout: 500,
                    clickTimeout: 10,
                };
            
            // 自动填写密码
            if (site.timeout) setTimeout(fillOnce, site.timeout);
            else fillOnce();
            function fillOnce() {
                if (site.checkError && $("div.error-content:visible").length)
                    return;
                if (site.inputSelector) {
                    let input = $(site.inputSelector + (site.hidden ? "" : ":visible")),
                        button = $(site.buttonSelector),
                        code = null;
                    function click() {
                        if (site.clickTimeout)
                            setTimeout(() => {
                                button = $(site.buttonSelector);
                                button[0].click();
                            }, site.clickTimeout);
                        else button[0].click();
                    }
                    
                    if (input.length) {
                        if (site.store) code = t.get(host, false);
                        else if (site.password) code = decodeURIComponent(t.search()) || t.hashcode();
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
                                            click();
                                        }
                                    }, 1000);
                                } else if (site.react) {
                                    let lastValue = input.val();
                                    input.val(code);
                                    let tracker = input[0]._valueTracker;
                                    if (tracker) tracker.setValue(lastValue);
                                    input[0].dispatchEvent(new Event("input", {bubbles: true}));
                                    click();
                                } else if (site.reverse) {
                                    click();
                                    input.val(code);
                                } else {
                                    input.val(code);
                                    click();
                                }
                                t.increase();
                                if (!site.Notice) t.subscribe();
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

        addCode(a, isInput = false) {
            // 奶牛快传
            if (a.host === "cowtransfer.com" && a.pathname !== "/")
                return;
            
            let mapped = this.mapHost(a.host),
                site = this.sites[mapped];
            if (site.regStr) {
                let codeRe = new RegExp("^" + site.regStr + "$", "i"),
                    other = Object.keys(this.sites).filter(s => s !== mapped);
                if (mapped !== "lanzou.com")
                    other.push("lanzou[iswx]\.com");
                else if (mapped !== "ctfile.com")
                    other.push("^(?:[a-z]\d{3}|\d{3}[a-z]|t00y|\\w+\\.ctfile)\.com$");

                if (site.redirect) this.redirect(a, site.redirect);
                
                if (site.cleanHash) {
                    let result = a.hash && /#(\/s\/\w{6})/.exec(a.hash);
                    if (result) {
                        if (a.pathname == '/') {
                            a.pathname = result[1];
                            a.hash = '';
                        }
                    }
                } else if (site.pathHash) {
                    if (a.pathname.match(/\/f\/\w+/))
                        a.href = a.href.replace("f/", "#/share-detail?id=");
                } else if (site.searchPath) {
                    if (!a.search)
                        a.search = "?path=%2F";
                }

                if (site.password) {
                    let result = a.hash.match("#(" + site.regStr + ")");
                    if (result) {
                        if (!t.search(a))
                                a.search = a.search ? a.search + "&password=" + encodeURIComponent(result[1]) : "password=" + encodeURIComponent(result[1]);
                        a.hash = "";
                    }
                }
                
                if (!codeRe.test(t.hashcode(a)) && !codeRe.test(t.search(a))) {
                    let reg = new RegExp(
                            "\\s*(?:提[取示]|访问|查阅|取件|密\\s*|口令|艾|Extracted-code|key|password|pwd)" + (locHost.startsWith("www.meijumi.") ? "?" : "") + "[码碼]?(?:--)?[】\\])）]?\\s*[\\u4e00-\\u9fa5]?[:： （(是为]?\\s*(" +
                                site.regStr +
                                ")|^[码碼]?[】\\])）]?\\s*[:：【\\[ （(]*\\s*(" +
                                site.regStr +
                                ")[】\\])）]?" + (isInput ? "\\b" : "$"),
                            "i"
                        ),
                        code = reg.exec($(a).text().trim());
                    if (code && (/^http/.test(code[1]) || /^http/.test(code[2])))
                        code = null;
                    for (
                        let i = 10, current = a;
                        current && current.localName != "body" && !code && i > 0;
                        i--, current = current.parentElement
                    ) {
                        if (locHost === "yun.hei521.cn" && current.id === "main")
                            break;
                        let next = current;
                        while (!code) {
                            if (!next) break;
                            else if (next.nodeValue) code = reg.exec(next.nodeValue.trim());
                            else if (!other.some(s => next.textContent.match(s)))
                                code = reg.exec(next.innerText.trim());

                            if (code && (/^http/.test(code[1]) || /^http/.test(code[2])))
                            code = null;
                            
                            next = next.nextSibling;
                        }
                    }

                    if (code) {
                        let c = code[1] || code[2];
                        a.href = a.href.replace(/%E6%8F%90%E5%8F%96%E7%A0%81$/, "");
                        if (site.store) t.set(mapped, c);
                        else if (site.password) {
                            if (!t.search(a))
                                a.search = a.search ? a.search + "&password=" + encodeURIComponent(c) : "password=" + encodeURIComponent(c);
                        } else {
                            a.href = a.href.replace(/%23.*$/, "");
                            a.hash = c;
                        }
                    } else {
                        if (site.store) t.delete(mapped);
                        t.clog("找不到code!");
                    }
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
                    include: "view/",
                    selector: "p.link",
                },

                "t.cn": {
                    // 新浪短链
                    include: "",
                    selector: "a.m-btn-orange",
                },

                "sunbox.cc": {
                    // 阳光盒子
                    include: "wp-content/themes/begin/go.php?url=",
                    selector: "a.alert-btn",
                },

                "www.itdaan.com": {
                    // 开发者知识库
                    include: "link/",
                    selector: "a.c-footer-a1",
                },

                "to.redircdn.com": {
                    include: "?",
                    selector: "a.bglink",
                },
                
                "link.csdn.net": {
                    // CSDN
                    include: "?target=",
                    selector: "a.loading-btn",
                    timeout: 100,
                },
                
                "support.qq.com": {
                    // 兔小巢
                    match: "products\\/\\d+\\/link-jump\\?jump=",
                    selector: "span.link_url",
                },
                
                "c.pc.qq.com": {
                    // QQ非官方页面
                    include: "middlem.html?pfurl=",
                    selector: "#url",
                },
                
                "docs.qq.com": {
                    // 腾讯文档
                    include: "scenario/link.html?url=",
                    selector: "span.url-src",
                    timeout: 500,
                },
                
                "www.tianyancha.com": {
                    // 天眼查
                    include: "security?target=",
                    selector: "div.security-link",
                },
                
                "www.yuque.com": {
                    // 语雀
                    include: "r/goto?url=",
                    selector: "button.ant-btn-primary>a",
                    timeout: 300,
                },
                
                "jump.bdimg.com": {
                    // 百度贴吧
                    include: "safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
                
                "jump2.bdimg.com": {
                    // 百度贴吧
                    include: "safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
                
                "iphone.myzaker.com" : {
                    // Zaker
                    include: "zaker/link.php?",
                    selector: "a.btn",
                },
                
                "game.bilibili.com": {
                    // 哔哩哔哩游戏
                    include: "linkfilter/?url=",
                    selector: "#copy-url",
                },
                
                "www.chinaz.com": {
                    // 站长之家
                    include: "go.shtml?url=",
                    selector: "div.link-bd__text",
                },

                "link.logonews.cn": {
                    // 标志情报局
                    include: "?url=",
                    selector: "a.button",
                },

                "www.douban.com": {
                    // 豆瓣
                    include: "link2/?url=",
                    selector: "a.btn-redir",
                },
                
                "link.zhihu.com": {
                    // 知乎
                    include: "?target=",
                    selector: "a.button",
                },
                
                "www.jianshu.com": {
                    // 简书
                    include: "go-wild?ac=2&url=",
                    selector: 'div[title^="http"], div[title^="www"]',
                },
                
                "link.juejin.cn": {
                    // 掘金
                    include: "?target=",
                    selector: 'p[style="margin: 0px;"]',
                },
                
                "www.oschina.net": {
                    // 开源中国
                    include: "action/GoToLink?url=",
                    selector: "a.link-button",
                },
                
                "www.youtube.com": {
                    // youtube
                    include: "redirect?q=",
                    selector: "#invalid-token-redirect-goto-site-button",
                },
            },

            redirect(host) {
                let site = this.sites[host];
                if (site) {
                    let include = host + "/" + site.include;
                    if (locHref.includes(include) || site.match && locHref.match(site.match)) {
                        setTimeout(redirect, site.timeout || 0);
                        return true;
                    }
                }

                function redirect() {
                    let target = $(site.selector);
                    if (target.length) location.replace(t.http(target[0].href || target[0].innerText));
                    else if (locHost == "t.cn" && $("div.text:contains('绿色上网')").length)
                        fetch(locHref).then(res => location.replace(res.headers.get("location")));
                    else t.clog('找不到跳转目标！');
                    t.increase();
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
                        history.pushState(null, null, locHref);
                        if (a.length) location.replace(a[0].href);
                        else t.showNotice("没有找到中文页面!");
                    }// else history.back();
                }
            },

            mozilla() {
                let isZh = locPath.includes("zh-"),
                    jumpToZh = t.get("jumpToZh", true);
                jump();
                function jump() {
                    if (!isZh && jumpToZh) {
                        let result = /developer\.mozilla\.org\/(.+?)\//.exec(
                            locHref
                        ), options = $("#language-selector").children(), flag = "";

                        if (result) {
                            for (let i = options.length; i > 0; i--) {
                                if (options[i - 1].value.startsWith("zh-")) {
                                    if (flag) {
                                        flag = options[i - 1].value;
                                        break;
                                    }
                                    flag = options[i - 1].value;
                                }
                            }
                            if (flag) {
                                let zh_url = locHref.replace(result[1], flag);
                                history.pushState(null, null, locHref);
                                location.replace(zh_url);
                            }
                            else t.showNotice("没有找到中文页面!");
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
            
            MSDocs() {
                let isZh = locPath.includes("zh-cn"),
                    jumpToZh = t.get("jumpToZh", true);
                if (!isZh && jumpToZh) {
                    history.pushState(null, null, locHref);
                    location.replace(locHref.replace(/docs.microsoft.com\/[a-z\-]{5}\//i, 'docs.microsoft.com/zh-cn/'));
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
                        history.pushState(null, null, locHref);
                        location.replace(locHref.replace(/docs.microsoft.com\/[a-z\-]{5}\//i, 'docs.microsoft.com/zh-cn/'));
                    }
                }
            },
            
            chrome() {
                if (location.search.includes('hl=')) {
                    let isZh = location.search.includes('hl=zh-CN'),
                        jumpToZh = t.get("jumpToZh", true);
                    if (!isZh && jumpToZh) {
                        history.pushState(null, null, locHref);
                        location.search = location.search.replace(/hl=[a-zA-Z]{2}-[a-zA-Z]{2}/, 'hl=zh-CN');
                    }

                    let menuID = t.registerMenu(
                        `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                        autoJump
                    );
                } else location.search += location.search ? '&hl=zh-CN' : '?hl=zh-CN';
                

                function autoJump() {
                    jumpToZh = !jumpToZh;
                    t.set("jumpToZh", jumpToZh);
                    t.unregisterMenu(menuID);
                    menuID = t.registerMenu(
                        `${jumpToZh ? "[✔]" : "[✖]"}自动切换中文`,
                        autoJump
                    );
                    if (!isZh && jumpToZh) {
                        history.pushState(null, null, locHref);
                        location.search = location.search.replace(/hl=[a-zA-Z]{2}-[a-zA-Z]{2}/, 'hl=zh-CN');
                    }
                }
            },
        };
        
        if (RedirectPage.redirect(locHost)) return;
        else if (locHost.match(/.+wiki(?:\.hancel|pedia)\.org/))
            RedirectPage.wiki();
        else if (locHost == "chrome.google.com")
            RedirectPage.chrome();
        else {
            if (locHost === "developer.mozilla.org") RedirectPage.mozilla();
            else if (locHost === "docs.microsoft.com") RedirectPage.MSDocs();
            
            let isChromium = navigator.userAgent.includes("Chrome");
            
            if (isChromium)
                $(document).on("selectstart mousedown", (obj) => listener(obj));
            else
                $(document).on("mouseup", (obj) => listener(obj));

            if (!t.get("excludeAll", false)) {
                if (locHost.includes("blog.csdn.net"))
                    document.body.addEventListener("click", function (obj) {
                        let e = obj.target;
                        if (e.localName === "a" && e.href && e.href.match(http_re_str)) {
                            if (e.id !== "btn-readmore-zk" && !(e.attributes.href && e.attributes.href.nodeValue.startsWith("#"))) {
                                obj.stopImmediatePropagation();
                                if (e.host !== "github.com" && e.host !== "chrome.google.com") window.open(e.href.replace(/\?utm_source=csdn_blog$/, ""));
                                obj.preventDefault();
                            }
                        }
                    }, true);
            }

            // 移除登录和注册按钮
            if (["hub.fastgit.org", "github.com.cnpmjs.org", "github.rc1844.workers.dev"].some(h => locHost === h)) {
                $(".HeaderMenu div.position-relative.mr-3, div.position-relative.mr-3+a, div.d-flex.flex-items-center>a").remove();
                if (locPath === "/")
                    $("form div.d-flex, div.home-nav-hidden>a").remove();
            }

            if (locHost === "bbs.pcbeta.com")
                $(document.head).append(`<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.min.css">`);

            GM_addStyle(`
                .lh-popup {
                    font-size: 1em;
                    font: 16px/1.5 'Microsoft Yahei',arial,helvetica,sans-serif;
                }

                .lh-content {
                    padding: 0;
                }
                
                .lh-close {
                    box-shadow: none;
                }

                .lh-close:focus {
                    box-shadow: none;
                }


                .lh-menu {
                    margin: 0;
                    padding: 0;
                    list-style: none;
                    font-size: 18px;
                }

                .lh-item {
                    padding-top: 20px;
                    margin-bottom: 0;
                }

                .lh-footer {
                    font-size: 16px;
                }

                .lh-footer a {
                    font-size: 18px;
                    font-weight: 700;
                }

                .lh-item label{
                    font-weight: normal;
                    display: inline-block;
                    font-size: 18px;
                    margin-bottom: 0;
                }

                .lh-item input {
                    -webkit-appearance: auto !important;
                    background: white;
                    width: auto;
                    height: auto;
                    float: none;
                    margin-bottom: 0;
                    border: 1px solid #e2e2e2;
                    font-size: 18px;
                    padding: 0;
                }

                .lh-item input[type="range"] {
                    display: inline-block;
                }

                .lh-item select {
                    width: auto;
                    border: 1px solid #e2e2e2;
                    font-size: 16px;
                    display: inline-block;
                    background-color: #f8f8f8;
                    color: #aaaaaa;
                    padding: 0 30px 0 2px;
                    border-radius: 3px;
                    height: 30px;
                    line-height: 28px;
                    outline: none;
                    appearance: none;
                    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAANCAYAAAC+ct6XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjBBRUQ1QTQ1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjBBRUQ1QTU1QzkxMTFFMDlDNDdEQzgyNUE1RjI4MTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGMEFFRDVBMjVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGMEFFRDVBMzVDOTExMUUwOUM0N0RDODI1QTVGMjgxMSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pk5mU4QAAACUSURBVHjaYmRgYJD6////MwY6AyaGAQIspCieM2cOjKkIxCFA3A0TSElJoZ3FUCANxAeAWA6IOYG4iR5BjWwpCDQCcSnNgxoIVJCDFwnwA/FHWlp8EIpHSKoGgiggLkITewrEcbQO6mVAbAbE+VD+a3IsJTc7FQAxDxD7AbEzEF+jR1DDywtoCr9DbhwzDlRZDRBgACYqHJO9bkklAAAAAElFTkSuQmCC);
                    background-position: center right;
                    background-repeat: no-repeat;
                }

                .lh-item button {
                    border: 1px solid #e2e2e2;
                    font-size: 16px;
                    padding: 2px 5px;
                    border-radius: 10px;
                    color: #000;
                    background-color: #f0f0f0;
                }

                .lh-item button:hover {
                    background-color: #3e97eb;
                    color: white;
                }

                @keyframes hover-color {
                    from {
                        border-color: #e2e2e2;
                    }
                    to {
                        border-color: #3e97eb;
                    } 
                }

                .lh-item input[type="checkbox"] {
                    display: none;
                    position: absolute;
                }

                .lh-item input[type="checkbox"]+span {
                    position: relative;
                    padding-left: 30px;
                    cursor: pointer;
                }

                .lh-item input[type="checkbox"]+span:hover:before {
                    animation-duration: 0.4s;
                    animation-fill-mode: both;
                    animation-name: hover-color;
                }

                .lh-item input[type="checkbox"]+span:before {
                    position: absolute;
                    top: 2px;
                    left: 5px;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    content: "";
                    border: 1px solid #e2e2e2;
                    border-radius: 3px;
                }

                .lh-item input[type="checkbox"]+span:after {
                    position: absolute;
                    display: none;
                    content: "";
                    top: 4px;
                    left: 12px;
                    box-sizing: border-box;
                    width: 6px;
                    height: 12px;
                    transform: rotate(45deg);
                    border-width: 2px;
                    border-style: solid;
                    border-color: #fff;
                    border-top: 0;
                    border-left: 0
                }

                .lh-item input[type="checkbox"]:checked+span:before {
                    animation-name: none;
                    border: #3e97eb;
                    background: #3e97eb;
                }

                .lh-item input[type="checkbox"]:checked+span:after {
                    display: block;
                }
            `);
            
            function showSettings() {
                let html = `<ul class="lh-menu">
                    <li class="lh-item">
                        <label title="勾选此项可关闭移除链接重定向功能">
                            <input type="checkbox" id="excludeAll" />
                            <span style="color: red">*</span>
                        </label>
                        <label title="例外域名对应的链接不会被净化或替换, 误净化或误替换时可添加以不移除重定向">
                            <input list="excludeHosts" id="excludeHost" placeholder="例外域名" />
                        </label>
                        <button id="addExcludeHost" title="添加例外域名">添加</button>
                        <datalist id="excludeHosts"></datalist>
                    </li>
                    <li class="lh-item">
                        <label title="默认500，步进50">
                            文本转链接的字符数限制
                            <br />
                            <input type="range" id="limitText" min="200" max="800" step="50" />
                            <br />
                            <span>500</span>
                        </label>
                    </li>
                    <li class="lh-item">
                        <label title="勾选后所有文本转链接后自动打开">
                            <input type="checkbox" id="autoClickAll" />
                            <span style="color: red">*</span>
                        </label>
                        <label title="域名对应的文本转链接后自动打开">
                            <input list="autoClickHosts" id="autoClickHost" placeholder="自动打开域名" />
                        </label>
                        <button id="addAutoClickHost" title="添加自动打开域名">添加</button>
                        <datalist id="autoClickHosts"></datalist>
                    </li>
                    <li class="lh-item">
                        <button type="button" id="autoClick" title="当前站点的文本转链接后自动打开">自动打开链接文本</button>
                        <select id="autoClickSites" title="自动打开链接文本的站点" style="display: none"></select>
                        <button id="removeAutoClick" title="删除文本转链接后自动打开的站点" style="display: none">删除</button>
                    </li>
                    <li class="lh-item">
                        <label title="维基百科、谷歌开发者、谷歌商店、Github无法访问时请勾选此项">
                            <input type="checkbox" id="jumpToMirror"/>
                            <span>自动切换镜像</span>
                        </label>
                        <label title="Github镜像站选择“是”后替换原链接，需要刷新页面才能重新选择，不勾选自动切换镜像时无法更改此项" style="margin-left: 20px">
                            <input type="checkbox" id="replaceMirror" />
                            <span>替换为镜像链接</span>
                        </label>
                    </li>
                    <li class="lh-item lh-target-blank">
                        <label title="启用新标签打开链接功能">
                            <input id="addBlank" type="checkbox" />
                            <span>新标签打开链接</span>
                        </label>
                        <label title="新标签打开相对链接，不勾选新标签打开时无法更改此项" style="margin-left: 20px">
                            <input id="relative" type="checkbox" />
                            <span>相对链接</span>
                        </label>
                    </li>
                    <li class="lh-item">
                        <button type="button" id="defaultTarget" title="当前站点的链接保持默认打开方式，优先级最高，多用于文档教程类网站">保持链接默认打开方式</button>
                        <select id="defaultTargetSites" title="链接保持默认打开方式的站点" style="display: none"></select>
                        <button id="removeDefault" title="删除链接默认打开方式的站点" style="display: none">删除</button>
                    </li>
                </ul>`;

                Swal.fire({
                        title: '链接助手配置',
                        html,
                        footer: '<div class="lh-footer">前往<a href="https://github.com/oneNorth7/LinkHelper" target="_blank" style="color: #3e97eb">项目主页</a>查看<a href="https://mp.weixin.qq.com/s?__biz=Mzg2MjU4MDM2NQ==&mid=2247486650&idx=1&sn=d4373164fbc1df2d4399ebfb542a44fe&chksm=ce04f758f9737e4e296d394f71d59a15948bd150f1b2d6746658a085be7aa716b5d54f81a1c5&token=2052139541&lang=zh_CN#rd" target="_blank" style="color: #36be63">详细说明</a>，有问题或建议请<a href="https://greasyfork.org/zh-CN/scripts/422773-链接助手/feedback#post-discussion" target="_blank" style="color: red">反馈</a></div>',
                        showCloseButton: true,
                        showConfirmButton: false,
                        customClass: {
                            popup: "lh-popup",
                            content: "lh-content",
                            closeButton: "lh-close"
                        },
                        didRender: () => {
                            
                            checkbox("excludeAll");
                            
                            datainput("excludeHost", "#addExcludeHost", "例外");
                            
                            $("#addExcludeHost")
                            .on("mouseenter", o => $("#excludeHost").blur());
                            
                            let len = t.get("textLength", 500);
                            if(len != 500) $("#limitText").val(len).nextAll("span").text(len);
                            $("#limitText").on("input", o => $(o.target).nextAll("span").text($(o.target).val()));
                            
                            checkbox("autoClickAll");
                            
                            datainput("autoClickHost", "#addAutoClickHost", "自动打开");
                            
                            $("#addAutoClickHost")
                            .on("mouseenter", o => $("#autoClickHost").blur());
                            
                            select("autoClickSites", "#autoClick");
                            
                            $("#removeAutoClick").on("click", o => {
                                let autoClickSites = t.get("autoClickSites", []),
                                    select = $("#autoClickSites"),
                                    selected = select[0].selectedOptions[0],
                                    value = selected.value;
                                if (confirm(`是否删除自动打开站点[${value}]`)) {
                                    autoClickSites = autoClickSites.filter(s => s != value)
                                    selected.remove();
                                    if (autoClickSites.length)
                                        t.set("autoClickSites", autoClickSites);
                                    else {
                                        t.delete("autoClickSites");
                                        $("#autoClick").show();
                                        select.hide();
                                        $("#removeAutoClick").hide();
                                    }
                                    if (value === locHost)
                                        $("#autoClick").show();
                                }
                            });
                            
                            $("#autoClick").on("click", o => {
                                let autoClickSites = t.get("autoClickSites", []),
                                    select = $("#autoClickSites");
                                autoClickSites.push(locHost);
                                select.append(`<option value="${locHost}" selected>${locHost}</option>`);
                                t.set("autoClickSites", autoClickSites);
                                $("#autoClick").hide();
                                select.show();
                                $("#removeAutoClick").show();
                            });
                            
                            checkbox("jumpToMirror");

                            checkbox("replaceMirror", true);
                            
                            checkbox("isAddBlank", true, "#addBlank");

                            checkbox("relative");
                            
                            select("defaultTargetSites", "#defaultTarget, .lh-target-blank");
                            
                            $("#removeDefault").on("click", o => {
                                let defaultSites = t.get("defaultTargetSites", []),
                                    select = $("#defaultTargetSites"),
                                    selected = select[0].selectedOptions[0],
                                    value = selected.value;
                                if (confirm(`是否删除保持默认打开方法站点[${value}]`)) {
                                    defaultSites = defaultSites.filter(s => s != value)
                                    selected.remove();
                                    if (defaultSites.length)
                                        t.set("defaultTargetSites", defaultSites);
                                    else {
                                        t.delete("defaultTargetSites");
                                        $("#defaultTarget").show();
                                        select.hide();
                                        $("#removeDefault").hide();
                                    }
                                    if (value === locHost) {
                                        $("#addBlank").parents("li").fadeIn();
                                        $("#relative").parents("li").fadeIn();
                                        $("#defaultTarget").show();
                                    }
                                }
                            });
                            
                            $("#defaultTarget").on("click", o => {
                                let defaultSites = t.get("defaultTargetSites", []),
                                    select = $("#defaultTargetSites");
                                defaultSites.push(locHost);
                                select.append(`<option value="${locHost}" selected>${locHost}</option>`);
                                t.set("defaultTargetSites", defaultSites);
                                $("#defaultTarget").hide();
                                select.show();
                                $("#removeDefault").show();
                                $("#addBlank").parents("li").fadeOut();
                                $("#relative").parents("li").fadeOut();
                            });
                        },
                        willClose: () => {
                            let len = $("#limitText").val();
                            if (len != "500" || t.get("textLength", false)) t.set("textLength", len);
                        },
                    });
                
                function checkbox(name, value = false, selector = "#" + name, disableFunc = () => {}) {
                    let checked = t.get(name, value),
                        current = $(selector),
                        next = current.parent().next().children();
                    current.prop("checked", checked);
                    if (next.length) {
                        if (next.prop("type") === "checkbox") checked = !checked;
                        next.prop("disabled", checked) && disableFunc();
                    }
                    
                    current.on("change", o => {
                        let checked = o.target.checked;
                        t.set(name, checked);
                        if (next.length) {
                            if (next.prop("type") === "checkbox") checked = !checked;
                            next.prop("disabled", checked) && disableFunc();
                        }
                    });
                }
                
                function select(name, hide = "") {
                    let data = t.get(name, []),
                        select = $("#" + name);
                    if (data.length) {
                        for (let d of data) {
                            if (d === locHost) {
                                hide && $(hide).hide();
                                select.append(`<option value="${d}" selected>${d}</option>`);
                            } else
                                select.append(`<option value="${d}">${d}</option>`);
                        }
                        select.show().next("button").show();
                    }
                }
                
                function datalist(name) {
                    let data = t.get(name, []),
                        list = $("#" + name);
                    if (data.length) {
                        for (let d of data)
                        list.append(`<option value="${d}"></option>`);
                    }
                }
                
                function datainput(inputId, btnSlt, title) {
                    let name = inputId + "s",
                        inputSlt = "#" + inputId;
                    datalist(name);
                    
                    
                    $(inputSlt).on("change", o => {
                        let data = t.get(name, []),
                            host = o.target.value.trim();
                        
                        if (data.includes(host))
                            $(btnSlt).prop("title", `删除${title}域名`).text("删除").one("click", o => {
                                if (confirm(`是否删除${title}域名<${host}>？`))
                                    del(name, inputSlt);
                                else
                                    $(inputSlt).val("");
                            });
                        else
                            $(btnSlt).prop("title", `添加${title}域名`).text("添加").one("click", o => add(name, inputSlt));
                    });
                }
                
                function add(name, selector) {
                    let node = $(selector),
                        value = node.val();
                    if (value && !value.includes("example.com") && value.match(/^[-\w]+(?:\.[-\w]+)+$/)) {
                        let data = t.get(name, []),
                            list = $("#" + name);
                        data.push(value);
                        t.set(name, data);
                        node.val("");
                        list.append(`<option value="${value}"></option>`);
                        t.showNotice(`添加域名<${value}>成功！`);
                    } else t.showNotice("请输入有效域名！");
                }
                
                function del(name, selector) {
                    let node = $(selector),
                        value = node.val();
                    if (value && !value.includes("example.com") && value.match(/^[-\w]+(?:\.[-\w]+)+$/)) {
                        let data = t.get(name, []),
                            list = $("#" + name);
                        data = data.filter(d => d != value);
                        t.set(name, data);
                        node.val("");
                        $("#" + name + `>option[value="${value}"]`).remove();
                        t.showNotice(`删除域名<${value}>成功！`);
                    } else t.showNotice("请输入有效域名！");
                }
            }
            
            t.registerMenu('🔗配置', showSettings);
            
            async function listener(obj) {
                let e = obj.originalEvent.explicitOriginalTarget || obj.originalEvent.target,
                    isTextToLink = false, isInput = false;
                if (e && !e.href) {
                    let flag = true,
                        selectNode = null;
                    for (
                        let current = e, limit = 5;
                        current.localName !== "html" && current.localName !== "body" && limit > 0;
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
                        } else if (['input', 'textarea'].some((tag) => tag === current.localName) && current.className == 'direct-input') {
                            let text = t.clean(current.value.replace(/点/g, '.').replace(/冒号/g, ":").replace(/再?斜杠/g, "/").replace("一八九", "189").replace("康姆", "com").replace(/[码碼]/, "："), [/[\u4e00-\u9fa5\u201c\u201d\uff08\uff09\u3008-\u3011]+/g, /^[:：]/]),
                                result = url_regexp.exec(text);
                            if (result) {
                                selectNode = document.createTextNode(text);
                                isInput = true;
                            }
                            else flag = false;
                            break;
                        }
                    }

                    if (e.localName !== "a" && flag) {
                        let node = selectNode || e;
                        if (node && node.nodeValue) e = text2Link(node, isInput);
                        if (e)
                            isTextToLink = true;
                    }
                }

                if (e && e.localName === "a" && e.href) {
                    let a = e, isPrevent = false, isCancel = false;
                    if (/^magnet:\?xt=urn:btih:|^ed2k:\/\/\|file\||^thunder:\/\//i.test(a.href)) {
                        $(a).removeAttr('target');
                        if (isTextToLink) a.click();
                        return;
                    }
                    
                    if (a.host === "pan.baidu.com" && a.hash.startsWith("#/transfer/send?surl="))
                        return;

                    let pan = YunDisk.sites[YunDisk.mapHost(a.host)];
                    if (!t.get("excludeAll", false)) {         
                        if (locHost == "bbs.nga.cn" || locHost == "nga.178.com" || locHost == "ngabbs.com") {
                            if (!(a.host == "bbs.nga.cn" || a.host == "nga.178.com" || a.host == "ngabbs.com"))
                                if (a.attributes.onclick && a.attributes.onclick.nodeValue.startsWith("ubbcode.showUrlAlert(event,this)"))
                                    a.onclick = null;
                        }
                        
                        if (locHost == "www.youtube.com" && a.href.includes("www.youtube.com/redirect?")) {
                            if (!a.style.padding) {
                                $("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer").css({padding: "10px 10px 10px 2px", lineHeight: 0, display: "inline-block"});
                                $("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer:first-child").css("padding-left", "10px");
                            }
                            a.classList.remove("yt-simple-endpoint");
                        }
                        
                        if (locHost == "www.facebook.com") {
                            a.onclick = function() { return false; };
                            if (a.host !== "github.com" || !t.get("jumpToMirror", false))
                                t.open(a.href);
                        }

                        if (!(pan || locHost === "blog.csdn.net"
                              || t.get("excludeHosts", []).some(s => a.host.includes(s))
                              || cleanRedirectLink(a))
                            ) {
                            let text = a.textContent.trim().replace(/…$/, "");
                            if (RegExp("^(" + http_re_str + ")$").test(text)) {
                                if (isLinkText(a)) {
                                    t.title(a, '【替换】');
                                    a.href = t.http(text, true);
                                    t.increase();
                                } else if (locHost == "twitter.com" && a.host == "t.co")
                                    a.href = t.http(text, true);
                                else if (!isTextToLink && !a.parentElement.className.includes("text2Link") && locHost !== "www.facebook.com" && a.host != "download.downsx.org" && isDifferent(a)) {
                                    a.onclick = function() { return false; };
                                    isPrevent = true;
                                    await t.confirm("是否使用链接文本替换目标链接后打开？",
                                            () => {
                                                // 是
                                                let linkTextPrefixes = t.get("linkTextPrefixes", []),
                                                    reg = /(?:http|https|\/|\%2F).*?\?.+?=|.*?\?/,
                                                    result = reg.exec(a.href);
                                                if (result) {
                                                    linkTextPrefixes.push(result[0]);
                                                    t.set("linkTextPrefixes", linkTextPrefixes);
                                                }
                                                t.title(a, '【替换】');
                                                a.href = t.http(text, true);
                                                t.increase();
                                            },
                                            () => {
                                                // 否
                                            },
                                            () => {
                                                // 取消
                                                isPrevent = false;
                                                isCancel = true;
                                                a.onclick = null;
                                    });
                                }
                            }
                        }
                    }
                    
                    if (!obj.originalEvent.button || isTextToLink) {
                        if (t.get("jumpToMirror", false)) {
                            if (a.host.includes("wikipedia.org")) {
                                // 维基百科
                                if (locHost !== "www.bing.com" && !locHost.includes("www.google."))
                                    a.host = a.host.replace(
                                        "wikipedia.org",
                                        "wiki.hancel.org"
                                    );
                            } else if (a.host.includes("developers.google.com")) {
                                // 谷歌开发者
                                if (!locHost == "developers.google.com")
                                    a.host = a.host.replace(
                                        "developers.google.com",
                                        "developers.google.cn"
                                    );
                            } else if (locHost !== "github.com" && a.host === "github.com" && !a.pathname.startsWith("/login") && !a.dataset.cancel) {
                                // Github
                                let mirrors = [
                                                ["fastgit", "hub.fastgit.org"],
                                                ["cnpmjs", "github.com.cnpmjs.org"],
                                                ["rc1844", "github.rc1844.workers.dev"]
                                              ],
                                    rand = t.rand(1, 9) % 3,
                                    mirror = mirrors[rand],
                                    next = mirrors[(rand + 1) % 3];
                                a.onclick = function() { return false; };
                                isPrevent = true;
                                await t.confirm(`是否跳转到【${mirror[0]}】镜像站？`,
                                                () => {
                                                    // 是
                                                    if (t.get("replaceMirror", true)) {
                                                        t.title(a, `已替换为【${mirror[0]}】镜像链接，请不要登录帐号！！！`);
                                                        a.host = a.host.replace("github.com", mirror[1]);
                                                    } else {
                                                        t.open(a.href.replace("github.com", mirror[1]));
                                                        isPrevent = false;
                                                    }
                                                    setTimeout(() => t.showNotice("镜像站请不要登录账号！！！\n镜像站请不要登录账号！！！\n镜像站请不要登录账号！！！"), 1000);
                                                },
                                                () => {
                                                    // 否
                                                    if (locHost === "blog.csdn.net") t.open(a.href);
                                                },
                                                () => {
                                                    // 取消
                                                    isPrevent = false;
                                                    isCancel = true;
                                                    a.onclick = null;
                                                    a.dataset.cancel = true;
                                                });
                            } else if (a.host.includes("chrome.google.com")) {
                                // 谷歌应用商店
                                if (isChromium) {
                                    a.onclick = function() { return false; };
                                    isPrevent = true;
                                    await t.confirm("是否跳转到【crx4chrome】镜像站？",
                                                    () => {
                                                        // 是
                                                        t.title(a);
                                                        a.href = a.href.replace(/chrome\.google\.com\/webstore\/detail[\/\w\-%]*(?=\w{32})/i, "www.crx4chrome.com/extensions/");
                                                    },
                                                    () => {
                                                        // 否
                                                        if (locHost === "blog.csdn.net") t.open(a.href);
                                                    },
                                                    () => {
                                                        // 取消
                                                        isPrevent = false;
                                                        isCancel = true;
                                                        a.onclick = null;
                                    });
                                }
                            }
                        }
                    }
                    
                    pan = YunDisk.sites[YunDisk.mapHost(a.host)];
                    if (pan) YunDisk.addCode(a, isInput);
                    
                    if (isTextToLink) {
                        let isClicked = false;
                        if (t.get("autoClickAll", false) || pan
                            || t.get("autoClickHosts", []).concat(YunDisk.pans).some(h => h === a.host)
                            || t.get("autoClickSites", []).some(h => h === locHost)) {
                            if (!isCancel) {
                                a.click();
                                isClicked = true;
                            }
                        }

                        if (isInput) {
                            if (!isClicked) a.click();
                            $('#L_DirectInput').val("");
                        }
                    }
                    
                    if (/^https?:\/\/www\.nruan\.com\/(page\/\d+)?/i.test(a.href))
                        $(a).removeAttr('target');
                    
                    add_blank(a);
                    
                    if (isPrevent) {
                        a.onclick = null;
                        a.click();
                    }
                }
            }
            
            let url_regexp_g = new RegExp(url_regexp, "ig");

            function text2Link(node, isInput) {
                let text = node.nodeValue;
                if (!["flashget://", "qqdl://", "tg://", "ss://", "ssr://", "vmess://", "trojan://", "115://", "aliyunpan://", "bdpan://", "BDLINK"].some(p => text.includes(p)) && ![/SHA-?(1|256)/i, /MD-?5/i].some(e => e.test(node.parentElement && node.parentElement.parentElement.textContent)) && (text.length < t.get("textLength", 500) || isInput)) {
                    let parent = null;
                    if (locHost === "tieba.baidu.com") {
                        if ((node.parentElement.localName === "div" && node.parentElement.id.match(/^post_content_\d+$/)) ||
                           (node.parentElement.localName === "span" && node.parentElement.className === "lzl_content_main")) {
                            text = node.parentElement.innerText.replace(/\n/g, "<br>");
                            parent = node.parentElement;
                        }
                    }

                    let result = url_regexp_g.test(text),
                        span = null,
                        count = 0,
                        isMail = false;
                    if (result) {
                        span = $("<span class='text2Link'></span>");
                        span.html(
                            text.replace(url_regexp_g, function ($1, $2) {
                                count++;
                                if ($1.includes("@") && !$1.match(/^https?:\/\/|\/@?|^magnet:/))
                                    return (isMail = true, `<a class="text2Link" href="mailto:${$1}">${$1}</a>`);
                                return $1.startsWith("http")
                                       ? `<a href="${$1}" target="_blank">${$1}</a>`
                                       : /^thunder:\/\//i.test($1)
                                       ? `<a href="${$1}" title="使用迅雷下载">${$1}</a>`
                                       : $1.includes("ed2k")
                                       ? `<a href="${$1}" title="使用BT软件下载">${$1}</a>`
                                       : $1.match(magnet_re_str)
                                       ? `<a href="magnet:?xt=urn:btih:${$1.includes("&tr=") ? $1.replace("magnet:?xt=urn:btih:", "") : $2.replace("magnet:?xt=urn:btih:", "")}" title="使用BT软件下载">${$1}</a>`
                                       : /^(?:\/?s)?\/[\w\-_]{23}$|^(?:\/?s)?\/\w{7,8}$/.test($1)
                                       ? `<a href="https://pan.baidu.com/s/${$1.replace(/^(?:\/?s)?\//, "")}" target="_blank">${$1}</a>`
                                       : `<a href="https://${$1}" target="_blank">${isInput ? "https://" + $1 : $1}</a>`;
                            })/*.replace(/点/g, '.')*/
                        );
                        if (parent) $(parent).html(span);
                        else if (isMail) $(node).replaceWith(span.html());
                        else $(node).replaceWith(span);
                    }
                    
                    if (count) t.increase();
                    
                    return !isMail && span && span.children("a")[0];
                }
            }

            function isLinkText(a) {
                let keywords = [
                    "jump.bdimg.com/safecheck/index?url=",
                    "jump2.bdimg.com/safecheck/index?url=",
                    "iphone.myzaker.com/zaker/link.php?pk=",
                    "www.coolapp.wang/goto/",
                ],
                    linkTextPrefixes = t.get("linkTextPrefixes", []);
                return keywords.some((k) => a.href.includes(k)) || linkTextPrefixes.some((k) => a.href.includes(k));
            }
            
            function isDifferent(a) {
                if (/(?:http|https|\/|\%2F).*?\?.+?=|.*?\?/.test(a.href)) {
                    let hash = a.hash, search = a.search, password = t.search(a);
                    a.hash = "";
                    if (password) a.search = "";
                    let text = decodeURIComponent(a.innerText.trim()).toLowerCase().replace(/^https?:\/\/|\/$/, '').replace(hash, ''),
                        href = decodeURIComponent(a.href).toLowerCase().replace(/^https?:\/\/|\/$/, '');
                    a.hash = hash;
                    if (password) a.search = search;
                    return !(text.includes('...') || !text.includes('/') || text == href);
                }
                return false;
            }

            let excludes = [
                "v.qq.com",
                "v.youku.com",
                "blog.csdn.net",
                "cloud.tencent.com",
                "translate.google.com",
                "domains.live.com",
                "www.iconfont.cn",
                "www.kdocs.cn",
                "help.aliyun.com",
                "service.weibo.com",
                "zhannei.baidu.com",
                "pc.woozooo.com",
                "play.google.com",
                "nimg.ws.126.net",
                "iapk.cc",
                "www.microsofttranslator.com",
                "whois.chinaz.com",
                "yandex.com",
                "lixian.vip.xunlei.com",
                "fanyi.baidu.com",
                "lanjing.jd.com",
                "image.baidu.com",
                "detail.1688.com",
                "api.",
                "passport.",
                "www.360kuai.com",
                "zhidao.baidu.com",
                "image.",
                "img.",
                "pic.",
            ];

            function cleanRedirectLink(a) {
                // 小众软件
                if (locHost == "www.appinn.com" && (a.search.includes("ref=appinn") || a.hash.includes("ref=appinn"))) {
                    t.title(a, "【净化】");
                    a.search = a.search.replace(/[?&]ref=appinn$/, '');
                    a.hash = a.hash.replace(/[#&]ref=appinn$/, '');
                    t.increase();
                    return true;
                }
                
                // 净化跳转链接
                let hosts = ["dalao.ru", "niao.su", "iao.su", "nicelinks.site", "www.appinn.com", "support.qq.com", locHost];
                for (let h of hosts) {
                    let reg = RegExp(`\\?(?:utm_source=)?${h}$`), result = reg.exec(a.href);
                    if (result) {
                        t.title(a, "【净化】");
                        a.href = a.href.replace(result[0], "");
                        t.increase();
                    }
                }
                
                // 语雀
                if (locHost === "www.yuque.com" && a.search.includes("fileGuid=")) {
                    t.title(a, "【净化】");
                    a.search = a.search.replace(/[?&]fileGuid=\w{16}$/, "");
                    t.increase();
                    return true;
                }
                
                // 那些免费的砖
                if (locHost === "www.thosefree.com") {
                    if (a.search.match("\\?from=thosefree\\.com")) {
                        t.title(a, "【净化】");
                        a.search = "";
                    }
                }
                if (!(["login", "logout", "signin", "signup", "signout", "auth", "oauth", "translate.google.com", "/images/"].some(k => a.href.includes(k))
                    || /登录|登入|登出|退出|注册|login|logout|signin|signup|signout/i.test(a.textContent)
                    || excludes.some((s) => a.host.includes(s)))
                ) {
                    let reg = new RegExp("^((?:http|https|\\/|\\%2F)(?:.*?[?&].+?=|.*?[?&]))(" + http_re_str + ")", "i"),
                        result = reg.exec(decodeURIComponent(a.href));
                    if (result) {
                        let temp = decodeURIComponent(
                            decodeURIComponent(result[2])
                        ).replace(/https?:\/\//, "");
                        if (!decodeURIComponent(locHref).replace(/https?:\/\//, "").includes(temp.split("&")[0])) {
                            if (!/t\d+\.html/i.test(temp)) {
                                let href = decodeURIComponent(
                                    decodeURIComponent(
                                        t.http(result[2])
                                    )
                                );

                                t.title(a, "【净化】");
                                if (!href.includes("?") && href.includes("&") || a.host.includes("google.com"))
                                    a.href = href.split("&")[0];
                                else a.href = href.replace(/______/g, ".");
                            }
                            t.increase();
                            return true;
                        }
                    } else {
                        reg = new RegExp("((?:http|https|\\/|\\%2F)(?:.*[?&].+?=|.*[?&]|.*\\/(?:go|goto|link)\\/))(" + base64_re_str + ")", "i");
                        result = reg.exec(decodeURIComponent(a.href));
                        if (result) {
                            try {
                                let temp = decodeURIComponent(escape(atob(result[2])));
                                if (temp.match("^" + http_re_str + "$")) {
                                    t.title(a, '【Base64】');
                                    a.href = temp;
                                    t.increase();
                                    return true;
                                }
                            } catch (err) {}
                        }
                    }
                }
            }

            // 给链接添加[target="_blank"]属性
            function add_blank(a) {
                let defaultTargetSites = t.get("defaultTargetSites", []),
                    isAddBlank = t.get("isAddBlank", true),
                    isDefault = defaultTargetSites.some((s) => s == location.host);
                if (isAddBlank && !isDefault) {
                    let result =
                            a.href == "" || a.target == "_blank" ||
                            /javascript[\w:;()]+/.test(a.href) ||
                            /\/\w+-\d+-\d+\.html|.+page\/\d+|category-\d+_?\d*/.test(
                                a.href
                            ) ||
                            /[前后後上下首末].+[页頁篇张張]|^\.*\s*\d+\s*\.*$|^next$|^previous$|^[＜＞]$/i.test(
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
                            /^#.+/.test(a.attributes.href && a.attributes.href.nodeValue) ||
                            a.href.endsWith(".user.js"),
                        relative = t.get("relative", false);
                    if (!relative && locHost !== "www.amazon.com")
                        result =
                            result ||
                            !/^(?:https?:|\/\/).+/.test(
                                a.attributes.href && a.attributes.href.nodeValue
                            );
                    if (!result) a.target = "_blank";
                }
            }
            
            // 添加链接直达输入框
            let addDirectTo = t.get("addDirectTo", true);
            if (addDirectTo) add_direct();
            let menuID2 = t.registerMenu(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达输入框`, directToMenu);
            
            function directToMenu() {
                addDirectTo = !addDirectTo;
                t.set("addDirectTo", addDirectTo);
                t.unregisterMenu(menuID2);
                menuID2 = t.registerMenu(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达输入框`, directToMenu);
                if (addDirectTo) add_direct();
                else if ($("#L_DirectTo").length) $("#L_DirectTo").remove();
            }
            
            function add_direct() {
                $('body').append(`<div id="L_DirectTo" class="l-direct-to">
                                    <input type="image" src="data:image/png;base64,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" alt="直达" id="L_DirectButton" class="direct-button" />
                                    <span title="粘贴或输入包含单链接的文本后点击输入框直达链接">
                                        <input type="text" id="L_DirectInput" class="direct-input" placeholder="粘贴或输入链接" />
                                    </span>
                                </div>`);
                GM_addStyle(`#L_DirectTo input {
                                outline: none;
                            }
                            #L_DirectTo {
                                position: fixed;
                                left: 0;
                                top: 25%;
                                z-index: 9999;
                            }
                            #L_DirectButton {
                                width: 30px;
                                height: 30px;
                                position: absolute;
                                z-index: 1;
                                left: -16px;
                                user-select: none;
                                padding: 0;
                                border: none;
                                background: transparent;
                                box-shadow: none;
                            }
                            #L_DirectInput {
                                width: 300px;
                                height: 22px;
                                position: absolute;
                                left: -350px;
                                border: 3px solid #b52bff;
                                border-radius: 20px;
                                background-color: #99adf7;
                                padding-left: 10px;
                                box-sizing: content-box;
                                user-select: none;
                                padding: 0;
                                box-shadow: none;
                            }
                            #L_DirectInput::placeholder {
                                color: #333;
                            }
                            `);
                
                
                
                let direct = $('#L_DirectTo'),
                    input = $('#L_DirectInput'),
                    button = $('#L_DirectButton');
                
                input.on('click', obj => listener(obj));
                input.on('paste', () => {
                    setTimeout(() => input[0].click(), 500);
                });
                
                input.val('');

                button.on('click', () => {
                        if (button.hasClass('open')) {
                            input.animate({ left: '-350px' }).val('').blur();
                            button.removeClass('open');
                            button.prop('title', '点击展开输入框');
                        } else {
                            button.addClass('open');
                            input.focus().animate({ left: '28px' });
                            button.prop('title', '点击收起输入框');
                        }
                    })
                    .on('mouseover', () => {
                        button.animate({ left: 0 });
                        if (!button.hasClass('open')) button.click();
                    })
                    .on('mouseout', () => {
                        if (!button.hasClass('open'))
                            button.animate({ left: '-16px' });
                    });
                
                let timeId = null;
                direct.on('mouseout', () => {
                        timeId = setTimeout(() => {
                            if (button.hasClass('open')) {
                                button.click();
                                button.animate({ left: '-16px' });
                            }
                        }, 5000);
                    })
                    .on('mouseover', () => {
                        if (timeId) clearTimeout(timeId);
                    });
            }
        }
    }
});