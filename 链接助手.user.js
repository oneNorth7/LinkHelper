// ==UserScript==
// @name            链接助手
// @namespace       https://github.com/oneNorth7
// @include         *
// @version         1.9.1
// @author          一个北七
// @run-at          document-body
// @description     大部分主流网盘和小众网盘自动填写密码; 跳转页面自动跳转; 文本转链接; 净化跳转链接; 维基百科及镜像、开发者文档、谷歌商店自动切换中文, 维基百科、谷歌开发者、谷歌商店、Github链接转为镜像链接; 新标签打开链接; (外部)链接净化直达
// @icon            https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png
// @compatible      chrome 69+
// @compatible      firefox 78+
// @compatible      edge Latest
// @noframes
// @license         GPL-3.0 License
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_notification
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_deleteValue
// @grant           GM_openInTab
// @grant           GM_addStyle
// @require         https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require         https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
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
            console.group('[链接助手]');
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
        
        title(a, mark='') {
            if (a.title)
                a.title += "\n" + mark + decodeURIComponent(a.href);
            else a.title = mark + decodeURIComponent(a.href);
        },
        
        hashcode(l=location) {
            return l.hash.slice(1);
        },
        
        search(l=location, p = 'password') {
            let args = l.search.slice(1).split('&');
            for (let a of args) {
                if (a.includes(p + '='))
                    return a.replace(p + '=', '');
            }
            return '';
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
                        position: 'center',
                        title,
                        confirmButtonText: '是',
                        cancelButtonText: '否',
                        showDenyButton: deny,
                        denyButtonText: '取消',
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
            let isFollowed = t.get('isFollowed', false), least_times = t.get('least_times', 50);
            success_times = +this.get("success_times");
            if (success_times > least_times && !isFollowed) {
                Swal.fire({
                          title: '\u5173\u6ce8\u516c\u4f17\u53f7\uff0c\u4e0d\u8ff7\u8def\uff01',
                          html: $(
                        `<div><img style="width: 300px;margin: 5px auto;" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png"><p style="font-size: 16px;color: red;">\u7b2c\u4e00\u65f6\u95f4\u83b7\u53d6<span style="color: gray;font-weight: 700;">\u3010\u94fe\u63a5\u52a9\u624b\u3011</span>\u66f4\u65b0\u63a8\u9001\uff01</p></div>`
                    )[0],
                          showCancelButton: true,
                          allowOutsideClick: false,
                          confirmButtonColor: '#d33',
                          confirmButtonText: '\u5df2\u5173\u6ce8\uff0c\u4e0d\u518d\u63d0\u9192\uff01',
                          cancelButtonColor: '#3085d6',
                          cancelButtonText: '\u7a0d\u540e\u5173\u6ce8',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: '\u611f\u8c22\u5173\u6ce8\uff01\uff01\uff01',
                              text: '\u4e00\u4e2a\u5317\u4e03\u4f1a\u7ee7\u7eed\u4e0d\u9057\u4f59\u529b\u5730\u521b\u4f5c\u66f4\u591a\u5b9e\u7528\u5de5\u5177',
                              showConfirmButton: false,
                              timer: 2000
                            });
                            t.set('isFollowed', true);
                          } else t.set('least_times', least_times + 50);
                        });
            }
        },
        
        update(name, value) {
            if (this.get('updated_version', '') != scriptInfo.version) {
                let data = this.get(name, false);
                if (data) {
                    for (let v of value) {
                        if (!data.some(d => d == v)) {
                            data.push(v);
                        }
                    }
                    this.set('updated_version', scriptInfo.version);
                    this.set(name, data);
                }
            }
        },
    };

    let url_re_str = "((?<![.@])\\w(?:[\\w._-])+@\\w[\\w\\._-]+\\.(?:com|cn|org|net|info|tv|cc|gov|edu|nz|me)|(?:https?:\\/\\/|www\\.)[\\w_\\-\\.~\\/\\=\\?&#%\\+:!*]+|(?<!@)(?:\\w[\\w._-]+\\.(?:com|cn|org|net|info|tv|cc|gov|edu|nz|me))(?:\\/[\\w_\\-\\.~\\/\\=\\?&#%\\+:!*\\u4e00-\\u9fa5]*)?)",
        url_regexp = new RegExp("\\b(" + url_re_str +
                            "|" +
                            "ed2k:\\/\\/\\|file\\|[^\\|]+\\|\\d+\\|\\w{32}\\|(?:h=\\w{32}\\|)?\\/" + 
                            "|" +
                            "magnet:\\?xt=urn:btih:\\w{40}(&[\\w\\s]+)?" +
                            "|" +
                            "(?:thunder:\\/\\/([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)(?![A-Za-z0-9+/]))" +
                            ")", "i");
    
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
        
        "www.gopojie.net": function () {
            if (/https:\/\/www\.gopojie\.net\/download\?post_id=/.test(locHref)) {
                setTimeout(() => {
                    let a = $('a.empty.button'), url = a.prop('href'), code = $('#tq').attr('data-clipboard-text');
                    if (url) a.prop('href', url + '#' + code);
                }, 1000);
            }
        },
        
        "www.acgjc.com": function () {
            if (/http:\/\/www.acgjc.com\/storage-download\/\?code=/.test(locHref)) {
                let codeNode = $('#theme_custom_storage-0-download-pwd');
                if (codeNode.length) {
                    let code = codeNode.val(),
                        link = codeNode.parents('div.fieldset-content').find('a');
                    if (link) link.prop('href', link[0].href + '#' + code);
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
        
        "www.zhiruanku.com": function () {
            if (/https:\/\/www\.zhiruanku\.com\/\d+/.test(locHref)) {
                $("div.wp-block-zibllblock-buttons a").each((i, a) => {
                    a.href = a.dataset.id
                    let result = a.textContent.match(":(\\w{2,10})");
                    if (result) a.hash = result[1];
                });
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
            },
            
            "h5.cloud.189.cn": {
                // 手机天翼云
                inputSelector: "input.access-code-input",
                buttonSelector: "div.button",
                regStr: "[a-z\\d]{4}",
                timeout: 100,
                password: true,
                inputEvent: true,
            },

            "lanzou.com": {
                // 蓝奏云
                inputSelector: "#pwd",
                buttonSelector: "#sub, .passwddiv-btn",
                regStr: "[a-z\\d]{2,10}",
                redirect: true,
                noNotice: true,
            },

            "ct.ghpym.com": {
                // 果核城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary",
                regStr: "[a-z\\d]{4,6}",
                timeout: 500, // >=125
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
                timeout: 1200,
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
            },

            "moecloud.cn": {
                // 萌云
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root",
                regStr: "[a-z\\d]{3,8}",
                timeout: 500,
                password: true,
            },
            
            "www.wenshushu.cn": {
                // 文叔叔
                inputSelector: "input.ivu-input",
                buttonSelector: "button.m-mg_t40",
                regStr: "[a-z\\d]{4}",
                timeout: 1000,
                inputEvent: true,
            },
            
            "mega.nz": {
                regStr: "[a-z\\d\\-_]{22}",
            },
            
            "gofile.me": {
                inputSelector: "#login_passwd",
                buttonSelector: 'button[aria-label="进入"]',
                regStr: "[a-z\\d]{4}",
                clickTimeout: 1000,
                store: true,
            },
            
            "www.jianguoyun.com": {
                // 坚果云
                inputSelector: "#access-pwd",
                buttonSelector: "button.action-button",
                regStr: "[a-z\\d]{6}",
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
                inputEvent: true,
                store: true,
            },
            
            "my.sharepoint.com": {
                // OneDrive
                inputSelector: '#txtPassword',
                buttonSelector: "#btnSubmitPassword",
                regStr: "[a-z\\d]{3,4}",
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
                timeout: 1500,
                multiEvent: true,
            },
            
            "disk.yandex.com": {}, // YandexDisk
            
        },
        
        pans: [
            "cowtransfer.com", // 奶牛快传
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
            "www.fangcloud.com", // 亿方云
            "gd.188988.xyz", // GD DISK
            "www.yun.cn", // UC网盘
            "www.yuque.com", // 语雀
            "shimo.im", // 石墨
        ],

        mapHost(host) {
            return host
                .replace(/^yun.baidu.com/, 'pan.baidu.com')
                .replace(/.*lanzou[isx]?.com/, 'lanzou.com')
                .replace(/^(?:[a-z]\d{3}|\d{3}[a-z])\.com$/, 'ct.ghpym.com')
                .replace('dl.sixyin.com', 'ct.ghpym.com')
                .replace('ct.bsh.me', 'ct.ghpym.com')
                .replace(/quqi\.\w+\.com/, 'quqi.com')
                .replace('feixin.10086.cn', '139.com')
                .replace('ws28.cn', 'www.wenshushu.cn')
                .replace('zb.my.to:5000', 'gofile.me')
                .replace('cloud.dnxshare.cn', 'drive.dnxshare.cn')
                .replace(/\w+\-my\.sharepoint\.(?:com|cn)/, 'my.sharepoint.com')
                .replace(/\w{6}.link.yunpan.360.cn|yunpan.cn/, 'yunpan.360.cn')
                .replace('mofile.own-cloud.cn', 'mo.own-cloud.cn')
                .replace('cloud.qingstore.cn', 'moecloud.cn')
                .replace('pan.mebk.org', 'moecloud.cn')
                .replace('cncncloud.com', 'moecloud.cn')
                .replace('ilolita945.softether.net:5212', 'moecloud.cn')
                .replace('my-file.cn', 'moecloud.cn')
                .replace('pan.bilnn.com', 'moecloud.cn')
                .replace('bx.qingstore.cn', 'moecloud.cn')
                .replace('drive.dnxshare.cn', 'moecloud.cn')
                .replace('pan.mba', 'moecloud.cn')
                .replace('yadi.sk', 'disk.yandex.com')
                .replace('nf.mail.163.com', 'u.163.com');
        },

        autoFill(host) {
            let site = this.sites[host];
            // 百度云文档
            if (host === "pan.baidu.com" && locPath.startsWith('/doc/share/'))
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
                if (site.inputSelector) {
                    let input = $(site.inputSelector),
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
                        if (site.store) code = t.get(host);
                        else if (site.password) code = decodeURIComponent(t.search());
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
                                } else if (site.multiEvent) {
                                    input.attr("value", code);
                                    button.attr("data-is-disabled", false);
                                        let data = JSON.stringify({share_id: location.pathname.replace('/s/', ''), share_pwd: code});
                                        $.ajax("https://api.aliyundrive.com/v2/share_link/get_share_token",
                                               {
                                                    type: "POST", data,
                                                    success: res => localStorage.setItem('shareToken', JSON.stringify(res))
                                               }).then(() => location.reload());
                                } else if (site.react) {
                                    let lastValue = input.val();
                                    input.val(code);
                                    let tracker = input[0]._valueTracker;
                                    if (tracker) tracker.setValue(lastValue);
                                    input.trigger("input");
                                    click();
                                } else if (site.password) {
                                    input.val(code);
                                    click();
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

        addCode(a) {
            // 手机百度云
            if (a.host === "pan.baidu.com" && a.pathname.startsWith('/wap/'))
                a.pathname = a.pathname.replace('/wap/', '/share/');
            
            let mapped = this.mapHost(a.host),
                site = this.sites[mapped],
                codeRe = new RegExp("^" + site.regStr + "$", "i");
            if (site.password) {
                let result = a.hash && /#(\/s\/\w{6})/.exec(a.hash);
                if (result)
                    if (a.pathname == '/') {
                        a.pathname = result[1];
                        a.hash = '';
                    }
            } else if (site.redirect) {
                a.host = a.host.replace('lanzous', 'lanzoux');
            }
            
            if (!codeRe.test(t.hashcode(a)) && !codeRe.test(t.search(a))) {
                let reg = new RegExp(
                        "\\s*(?:提[取示]|访问|查阅|密\\s*|艾|Extracted-code|key|password|pwd)[码碼]?\\s*[\\u4e00-\\u9fa5]?[:： （(是]?\\s*(" +
                            site.regStr +
                            ")|^[码碼]?\\s*[:：【\\[ （(]?\\s*(" +
                            site.regStr +
                            ")[】\\]]?$",
                        "i"
                    ),
                    code = reg.exec($(a).text().trim());
                for (
                    let i = 10, current = a;
                    current && !code && i > 0;
                    i--, current = current.parentElement
                ) {
                    let next = current;
                    while (!code) {
                        if (!next) break;
                        else code = reg.exec($(next).text().trim());
                        
                        if (a.host === "www.aliyundrive.com") next = next.previousSibling;
                        else next = next.nextSibling;
                    }
                }

                if (code) {
                    let c = code[1] || code[2];
                    if (site.store) t.set(mapped, c);
                    else if (site.password) {
                        if (!t.search(a))
                            a.search = a.search ? a.search + '&' + 'password=' + encodeURIComponent(c) : 'password=' + encodeURIComponent(c);
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
                    selector: "a.open-in-new-window, div.actions>a",
                },

                "t.cn": {
                    // 新浪短链
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
                    // CSDN
                    include: "https://link.csdn.net/?target=",
                    selector: "a.loading-btn",
                    timeout: 100,
                },
                
                "support.qq.com": {
                    include: "support.qq.com/products/",
                    selector: "span.link_url",
                },
                
                "www.tianyancha.com": {
                    // 天眼查
                    include: "www.tianyancha.com/security?target=",
                    selector: "a.security-btn",
                },
                
                "www.yuque.com": {
                    // 语雀
                    include: "www.yuque.com/r/goto?url=",
                    selector: "button.ant-btn-primary>a",
                    timeout: 300,
                },
                
                "jump.bdimg.com": {
                    // 百度贴吧
                    include: "jump.bdimg.com/safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
                
                "jump2.bdimg.com": {
                    // 百度贴吧
                    include: "jump2.bdimg.com/safecheck/index?url=",
                    selector: "div.warning_info.fl>a",
                },
            },

            redirect(host) {
                let site = this.sites[host];
                if (locHref.includes(site.include)) {
                    if (site.timeout) setTimeout(redirect, site.timeout);
                    else redirect();
                    
                    function redirect() {
                        let target = $(site.selector);
                        if (target.length) location.replace(target[0].href || target[0].innerText);
                        else if (locHost == "t.cn" && $("div.text:contains('绿色上网')").length)
                            fetch(locHref).then(res => location.replace(res.headers.get("location")));
                        else t.clog('找不到跳转目标！');
                        t.increase();
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
                        history.pushState(null, null, locHref);
                        if (a.length) location.replace(a[0].href);
                        else t.showNotice("没有找到中文页面!");
                    }// else history.back();
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
                        ), options = $("#language-selector").children(), flag = false;

                        if (result) {
                            for (let i = options.length; i > 0; i--) {
                                if (options[i - 1].value === "zh-CN") {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                let zh_url = locHref.replace(result[1], "zh-CN");
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
        
        if (locHost.match(/.+wiki(?:\.sxisa|pedia)\.org/))
            RedirectPage.wiki();
        else if (locHost == "chrome.google.com")
            RedirectPage.chrome();
        else {
            if (locHost === "developer.mozilla.org") RedirectPage.mozilla();
            else if (locHost === "docs.microsoft.com") RedirectPage.MSDocs();
            
            let isChromium = navigator.appVersion.includes("Chrome");
            
            $(document).on("mouseup", (obj) => listener(obj));
            
            if (isChromium && (locHost == "www.52pojie.cn" || /htm_(data|mob)\/\d+\/\d+\/\d+\.html|cl.\d+[xyz].xyz\/\w+\.php.*/.test(locHref)))
                $(document).on("selectstart", (obj) => listener(obj));
            
            if (locHost.includes("blog.csdn.net"))
                document.body.addEventListener("click", function (obj) {
                    let e = obj.target;
                    if (e.nodeName.toLocaleLowerCase() === "a") {
                        obj.stopImmediatePropagation();
                        window.open(e.href);
                        obj.preventDefault();
                    }
                }, true);
            
            if (locHost === "www.yuque.com") {
                setTimeout(() => {
                    let article = $("#content");
                    article.replaceWith(article.clone());
                }, 3000);
            }
            
            // 移除登录和注册按钮
            if (["hub.fastgit.org", "github.com.cnpmjs.org", "github.rc1844.workers.dev"].some(h => locHost === h)) {
                $(".HeaderMenu div.position-relative.mr-3, div.position-relative.mr-3+a, div.d-flex.flex-items-center>a").remove();
                if (location.pathname === "/")
                    $("form div.d-flex, div.home-nav-hidden>a").remove();
            }
            
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
                            let text = t.clean(current.value.replace(/点/g, '.'), [/[\u4e00-\u9fa5\u3002\uff1b\uff0c\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]+/g, /^[:：]/, /App.*$/]),
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
                        if (node && node.nodeValue) e = text2Link(node);
                        else e = textToLink(e);
                        if (e)
                            isTextToLink = true;
                    }
                }

                if (e && e.localName === "a" && e.href) {
                    let a = e, isPrevent = false;
                    if (locHref.includes("mod.3dmgame.com/mod/"))
                        a.search = "3dmgame.com";
                                    
                    if (locHost == "bbs.nga.cn" || locHost == "nga.178.com" || locHost == "ngabbs.com") {
                        if (!(a.host == "bbs.nga.cn" || a.host == "nga.178.com" || a.host == "ngabbs.com"))
                            if (a.attributes.onclick && a.attributes.onclick.nodeValue.startsWith("ubbcode.showUrlAlert(event,this)"))
                                a.onclick = null;
                    }
                    
                    if (locHost == "twitter.com" && a.host == "t.co") a.href = t.http(a.innerText, true);
                    
                    if (locHost == "www.youtube.com" && a.href.includes("www.youtube.com/redirect?")) {
                        if (!a.style.padding) {
                            $("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer").css({padding: "10px 10px 10px 2px", lineHeight: 0, display: "inline-block"});
                            $("#secondary-links.ytd-c4-tabbed-header-renderer a.ytd-c4-tabbed-header-renderer:first-child").css("padding-left", "10px");
                        }
                        a.classList.remove("yt-simple-endpoint");
                    }
                    
                    if (locHost == "www.facebook.com") {
                        a.onclick = function() { return false; };
                        t.open(a.href);
                    }
                    
                    if (!cleanRedirectLink(a) && RegExp("^" + url_re_str + "$", "i").test(a.innerText)) {
                        if (isLinkText(a)) {
                            t.title(a, '【替换】');
                            a.href = t.http(a.innerText, true);
                            t.increase();
                        }
                        else if (!isTextToLink && !a.parentElement.className.includes('text2Link') && !a.parentElement.className.includes('textToLink') && locHost != 'www.facebook.com' && a.host != 'download.downsx.org' && isDifferent(a)) {
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
                                        a.href = t.http(a.innerText, true);
                                        t.increase();
                                    },
                                    () => {
                                        // 否
                                    },
                                    () => {
                                        // 取消
                                        isPrevent = false;
                                        a.onclick = null;
                            });
                        }
                    }
                    
                    if (jumpToMirror) {
                        if (a.host.includes("wikipedia.org")) {
                            // 维基百科
                            if (!locHost == "www.bing.com" || !locHost.includes("www.google."))
                                a.host = a.host.replace(
                                    "wikipedia.org",
                                    "wiki.sxisa.org"
                                );
                        } else if (a.host.includes("developers.google.com")) {
                            // 谷歌开发者
                            if (!locHost == "developers.google.com")
                                a.host = a.host.replace(
                                    "developers.google.com",
                                    "developers.google.cn"
                                );
                        } else if (locHost !== "github.com" && a.host === "github.com") {
                            // Github
                            a.onclick = function() { return false; };
                            isPrevent = true;
                            await t.confirm('是否跳转到【fastgit】镜像站？',
                                            () => {
                                                // 是
                                                // a.host = a.host.replace("github.com", "github.com.cnpmjs.org");
                                                a.host = a.host.replace("github.com", "hub.fastgit.org");
                                                // a.host = a.host.replace("github.com", "github.rc1844.workers.dev");
                                                t.title(a, "已替换为fastgit镜像链接，请不要登录帐号！！！");
                                                setTimeout(() => t.showNotice('镜像站请不要登录账号！！！\n镜像站请不要登录账号！！！\n镜像站请不要登录账号！！！'), 1000);
                                            },
                                            () => {
                                                // 否
                                            },
                                            () => {
                                                // 取消
                                                isPrevent = false;
                                                a.onclick = null;

                            });
                        } else if (a.host.includes("chrome.google.com")) {
                            // 谷歌应用商店
                            if (isChromium) {
                                a.onclick = function() { return false; };
                                isPrevent = true;
                                await t.confirm('是否跳转到【crx4chrome】镜像站？',
                                                () => {
                                                    // 是
                                                    t.title(a);
                                                    a.href = a.href.replace(/chrome\.google\.com\/webstore\/detail[\/\w\-%]*(?=\w{32})/i, 'www.crx4chrome.com/extensions/');
                                                },
                                                () => {
                                                    // 否
                                                },
                                                () => {
                                                    // 取消
                                                    isPrevent = false;
                                                    a.onclick = null;

                                });
                            }
                        }
                    }
                    
                    let pan = YunDisk.sites[YunDisk.mapHost(a.host)];
                    if (pan) YunDisk.addCode(a);
                    
                    if (isTextToLink) {
                        let isClicked = false;
                        if (pan || t.get("autoClickSites", []).concat(YunDisk.pans).some(h => h == a.host) || /^magnet:\?xt=urn:btih:|^ed2k:\/\/\|file\||^thunder:\/\//i.test(a.href)) {
                            a.click();
                            isClicked = true;
                        }

                        if (isInput) {
                            if (!isClicked) a.click();
                            $('#L_DirectInput').val('');
                        }
                    }
                    
                    if (/^magnet:\?xt=urn:btih:|^ed2k:\/\/\|file\||^thunder:\/\//i.test(a.href))
                        $(a).removeAttr('target');
                    
                    add_blank(a);
                    
                    if (isPrevent) {
                        a.onclick = null;
                        a.click();
                    }
                }
            }
            
            // 注册菜单项添加文本转链接后自动跳转域名
            t.registerMenu('添加自动跳转域名', addAutoClick);
            
            function addAutoClick() {
                let autoClickSites = t.get("autoClickSites", []), input = prompt("输入的域名的链接文本转链接后会自动跳转", locHost);
                if (input) {
                    if (/[\w]+(\.[\w]+)+/.test(input)) {
                        if (!autoClickSites.some((s) => s.includes(input))) {
                            autoClickSites.push(input);
                            t.set("autoClickSites", autoClickSites);
                        } else t.showNotice(`域名 <${input}> 已存在!!!`);
                    } else t.showNotice(`<${input}> 不是有效域名!!!`);
                }
            }
            
            // 注册菜单项自动切换镜像
            let jumpToMirror = t.get("jumpToMirror", true);
            
            let menuID = t.registerMenu(
                        `${jumpToMirror ? "[✔]" : "[✖]"}自动切换镜像`,
                        autoJump
                    );

            function autoJump() {
                jumpToMirror = !jumpToMirror;
                t.set("jumpToMirror", jumpToMirror);
                t.unregisterMenu(menuID);
                menuID = t.registerMenu(
                    `${jumpToMirror ? "[✔]" : "[✖]"}自动切换镜像`,
                    autoJump
                );
            }
            
            if (RedirectPage.sites[locHost]) RedirectPage.redirect(locHost);
            
            let textLength = t.get("textLength", 200);

            // t.registerMenu(
            //     `设置文本字数限制(${textLength})`,
            //     limitText
            // );

            // function limitText() {
            //     let input = prompt(
            //         "请输入文本字数限制: ",
            //         t.get("textLength", 200)
            //     );
            // }
            
            let url_regexp_g = new RegExp(url_regexp, "ig");
            
            function textToLink(e) {
                if (
                    !["body", "code", "pre", "select", "main", "input", "textarea"].some(
                        (tag) => tag === e.localName
                    ) &&
                    !["www.google."].some((h) => locHost.includes(h))
                ) {
                    let span = null,
                        count = 0;
                    if (e.childNodes.length < 10)
                        for (
                            let i = e.childNodes.length - 1;
                            i >= 0;
                            i--
                        ) {
                            let child = e.childNodes[i];
                            if (
                                !["a", "br", "code", "pre", "img", "script", "option", "input", "textarea"].some(
                                    (tag) => tag === child.localName
                                ) && 
                                child.className !== "textToLink" &&
                                child.textContent.length < textLength
                            ) {
                                let text = child.textContent,
                                    result = url_regexp_g.test(text);
                                if (result) {
                                    span = $("<span class='textToLink'></span>");
                                    span.html(
                                        text.replace(url_regexp_g, function ($1) {
                                            count++;
                                            if ($1.includes("@")) return `<a href="mailto:${$1}">${$1}</a>`;
                                            return $1.startsWith("http")
                                                ? `<a href="${$1}" target="_blank">${$1}</a>`
                                                : $1.includes("magnet") || $1.includes("ed2k")
                                                ? `<a href="${$1}" title="使用BT软件下载">${$1}</a>`
                                                : /^thunder:\/\//i.test($1)
                                                ? `<a href="${$1}" title="使用迅雷下载">${$1}</a>`
                                                : `<a href="https://${$1}" target="_blank">${$1}</a>`;
                                        })
                                    );
                                    $(child).replaceWith(span);
                                }
                            }
                        }
                    if (count) t.increase();
                    return count == 1 && span && span.children()[0];
                }
            }

            function text2Link(node) {
                if (node.nodeValue.length < textLength) {
                    let text = node.nodeValue,
                        result = url_regexp_g.test(text),
                        span = null,
                        count = 0;
                    if (result) {
                        span = $("<span class='text2Link'></span>");
                        span.html(
                            text.replace(url_regexp_g, function ($1) {
                                count++;
                                if ($1.includes("@")) return `<a href="mailto:${$1}">${$1}</a>`;
                                return $1.startsWith("http")
                                    ? `<a href="${$1}" target="_blank">${$1}</a>`
                                    : $1.includes("magnet") || $1.includes("ed2k")
                                    ? `<a href="${$1}" title="使用BT软件下载">${$1}</a>`
                                    : /^thunder:\/\//i.test($1)
                                    ? `<a href="${$1}" title="使用迅雷下载">${$1}</a>`
                                    : `<a href="https://${$1}" target="_blank">${$1}</a>`;
                            })/*.replace(/点/g, '.')*/
                        );
                        $(node).replaceWith(span);
                    }
                    
                    if (!result) {
                        result = /\b\w{40}\b/i.exec(text);
                        if (result) {
                            span = $("<span class='text2Link'></span>");
                            span.html(
                                text.replace(/\w{40}/i, function ($1) {
                                        count++;
                                        return `<a href="magnet:?xt=urn:btih:${$1}" title="使用BT软件下载">${$1}</a>`;
                                    })
                            );
                            $(node).replaceWith(span);
                        }
                    }
                    
                    if (count) t.increase();
                    return count == 1 && span && span.children()[0];
                }
            }

            function isLinkText(a) {
                let keywords = [
                    "niao.su/go",
                    "www.sunweihu.com/go/?url=",
                    "jump.bdimg.com/safecheck/index?url=",
                    "jump2.bdimg.com/safecheck/index?url=",
                    "zhouxiaoben.info/wp-content/themes/begin/go.php?url=",
                    "www.423down.com/wp-content/plugins/momgo/go.php?url=",
                    "www.423down.com/go.php?url=",
                    "www.ccava.net/xc_url/?url=",
                    "www.imaybes.cc/wl?url=",
                    "iphone.myzaker.com/zaker/link.php?pk=",
                    "www.qiuziyuan.net/e/DownSys/DownSoft/?classid=",
                ],
                    linkTextPrefixes = t.get("linkTextPrefixes", []);
                return keywords.some((k) => a.href.includes(k)) || linkTextPrefixes.some((k) => a.href.includes(k));
            }
            
            function isDifferent(a) {
                if (/(?:http|https|\/|\%2F).*?\?.+?=|.*?\?/.test(a.href)) {
                    let hash = a.hash, search = a.search, password = t.search(a);
                    a.hash = "";
                    if (password) a.search = "";
                    let text = decodeURIComponent(a.innerText).toLowerCase().replace(/^https?:\/\/|\/$/, '').replace(hash, ''),
                        href = decodeURIComponent(a.href).toLowerCase().replace(/^https?:\/\/|\/$/, '');
                    a.hash = hash;
                    if (password) a.search = search;
                    return !(text.includes('...') || !text.includes('/') || text == href);
                }
                return false;
            }

            let excludeSites = [
                "v.qq.com",
                "v.youku.com",
                "blog.csdn.net",
                "cloud.tencent.com",
                "translate.google.com",
                "domains.live.com",
                "passport.yandex.ru",
                "www.iconfont.cn",
                "www.kdocs.cn",
                "help.aliyun.com",
                "cn.bing.com",
                "service.weibo.com",
                "zhannei.baidu.com",
                "pc.woozooo.com",
                "play.google.com",
                "nimg.ws.126.net",
            ];
            
            t.update('excludeSites', excludeSites);
            
            excludeSites = t.get("excludeSites", excludeSites);
            
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
                // 小众软件
                if (locHost == 'www.appinn.com' && (a.search.includes('ref=appinn') || a.hash.includes('ref=appinn'))) {
                    t.title(a, '【净化】');
                    a.search = a.search.replace(/[?&]ref=appinn$/, '');
                    a.hash = a.hash.replace(/[#&]ref=appinn$/, '');
                    t.increase();
                    return true;
                }
                
                // 净化跳转链接
                let hosts = ['dalao.ru', 'niao.su', 'iao.su', 'nicelinks.site', 'www.appinn.com', 'support.qq.com', locHost];
                for (let h of hosts) {
                    let reg = RegExp(`\\?(?:utm_source=)?${h}$`), result = reg.exec(a.href);
                    if (result) {
                        t.title(a, '【净化】');
                        a.href = a.href.replace(result[0], '');
                        t.increase();
                    }
                }
                
                // 移除链接末尾的&z和%26z/
                if (/htm_(data|mob)\/\d+\/\d+\/\d+\.html|cl.\d+[xyz].xyz\/\w+\.php.*/.test(locHref)) {
                    a.href = a.href.replace('https://to.redircdn.com/?', '').replace(/(?:%26|&)z\/?$|%26%23160%3B$/i, '').replace(/______/g, '.');
                    return true;
                }
                
                // 语雀
                if (locHost === "www.yuque.com" && a.search.includes('fileGuid=')) {
                    t.title(a, '【净化】');
                    a.search = a.search.replace(/[?&]fileGuid=\w{16}$/, '');
                    t.increase();
                    return true;
                }
                
                // 那些免费的砖
                if (locHost === "www.thosefree.com") {
                    if (a.search.match("\\?from=thosefree\\.com")) {
                        t.title(a, '【净化】');
                        a.search = '';
                    }
                }

                let reg = new RegExp('^((?:http|https|\\/|\\%2F)(?:.*?[?&].+?=|.*?[?&]))' + url_re_str, "i"),
                    result = reg.exec(decodeURIComponent(a.href));
                if (result) {
                    let temp = decodeURIComponent(
                        decodeURIComponent(result[2])
                    ).replace(/https?:\/\//, '');
                    if (
                        !(
                            decodeURIComponent(locHref).replace(/https?:\/\//, '').includes(
                                temp.split("&")[0]
                            ) || ['login', 'oauth'].some(k => locHref.includes(k)) || /登录|注册|log|sign/i.test(a.textContent) ||
                            excludeSites.some((s) => result[1].includes(s)) ||
                            YunDisk.sites[YunDisk.mapHost(a.host)]
                        )
                    ) {
                        if (!/t\d+\.html/i.test(temp)) {
                            let href = decodeURIComponent(
                                decodeURIComponent(
                                    result[2].startsWith("http")
                                        ? result[2]
                                        : "http://" + result[2]
                                )
                            );

                            t.title(a, '【净化】');
                            if (["c.pc.qq.com","mail.qq.com", "m.sogou.com", "www.douban.com", "www.google.com", "txt.guoqiangti.ga", "g.luciaz.me"].some((h) => a.host == h))
                                a.href = href.split("&")[0];
                            else a.href = href;
                        }
                        t.increase();
                        return true;
                    }
                }

            }

            let defaultTargetSites = t.get("defaultTargetSites", ['shuax.com', 'app.infinityfree.net']);
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
                            a.href.endsWith(".user.js"),
                        relative = t.get("relative", false);
                    if (!relative)
                        result =
                            result ||
                            !/^(?:https?|\/\/).+/.test(
                                a.attributes.href && a.attributes.href.nodeValue
                            );
                    if (!result) a.target = "_blank";
                }
            }
            
            // 添加链接直达输入框
            let addDirectTo = t.get('addDirectTo', true);
            if (addDirectTo) add_direct();
            let menuID2 = t.registerMenu(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达输入框`, directToMenu);
            
            function directToMenu() {
                addDirectTo = !addDirectTo;
                t.set('addDirectTo', addDirectTo);
                t.unregisterMenu(menuID2);
                menuID2 = t.registerMenu(`${addDirectTo ? "[✔]" : "[✖]"}显示链接直达输入框`, directToMenu);
                if (addDirectTo) add_direct();
                else if ($('#L_DirectTo').length) $('#L_DirectTo').remove();
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
                            }
                            #L_DirectButton {
                                width: 30px;
                                height: 30px;
                                position: absolute;
                                z-index: 1;
                                left: -16px;
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