// ==UserScript==
// @name            链接助手
// @namespace       https://github.com/oneNorth7
// @match           *://*/*
// @version         1.2.5
// @author          一个北七
// @run-at          document-body
// @description     常用网盘自动填写密码; 跳转页面自动跳转; 文本转链接; 净化跳转链接; 维基百科及镜像、Mozilla开发者自动切换中文(可控), 维基百科、谷歌开发者链接转为镜像链接; 新标签打开链接(可控)
// @license         GPL-3.0 License
// @grant           GM_registerMenuCommand
// @grant           GM_unregisterMenuCommand
// @grant           GM_notification
// @grant           GM_info
// @grant           GM_setValue
// @grant           GM_getValue
// @noframes
// @icon            https://raw.fastgit.org/oneNorth7/LinkHelper/main/asset/link-helper.png
// @created         2021/1/26 下午18:03:47
// ==/UserScript==

!function() {
    // 显示消息通知
    function showNotice(msg) {
        GM_notification({
            text: msg,
            title: GM_info.script.name,
            highlight: false,
            silent: false,
            timeout: 60
        });
    }
    
    let url_regexp = /((?:https?:\/\/|www\.)[\x21-\x7e]+[\w\/=]|\w(?:[\w._-])+@\w[\w\._-]+\.(?:com|cn|org|net|info|tv|cc|gov|edu)|(?:\w[\w._-]+\.(?:com|cn|org|net|info|tv|cc|gov|edu))(?:\/[\x21-\x7e]*[\w\/])?)/i;
    
    // 网盘密码预处理
    if ( /http:\/\/www\.38hack\.com\/\d+\.html/.test(location.href) ) {  // 爱之语
        let lines = document.querySelectorAll('div.down-line');
        if (lines.length) lines[lines.length-1].appendChild(lines[0].previousElementSibling.previousElementSibling);
    }
    else if (/https:\/\/www\.mikuclub\.org\/\d+/.test(location.href)) { // 初音社
        let password = document.querySelector('.password1');
        if (password) document.querySelector('a.download').hash = password.value;
    }
    else if ( /https:\/\/www\.acggw\.com\/\d+\.html/.test(location.href) ) { // ACG港湾
        let ps = document.querySelectorAll('.single-content>p'), l = null, m = null;
        for (let p of ps) {
          if (p.innerText.startsWith('链接：')) l = p;
          if (l && p.innerText.startsWith('密码：')) l.innerText += '#' + p.innerText.replace('密码：', '');
          if (m && p.innerText.startsWith('国外M盘：')) m.innerText += '#' + p.innerText.replace('国外M盘：', '');
          if (p.innerText.startsWith('国外M盘：http')) m = p;
        }
    }
    else if ( /http:\/\/www\.olecn\.com\/download\.php\?id=\d+/.test(location.href) ) { // 百度网盘资源
        let lis = document.querySelectorAll('div.plus_l li');
        let a = document.querySelector('div.panel-body a');
        a.hash = lis[3].innerText.replace('网盘提取码 ：', '');
    } else if ( /https:\/\/www\.qiuziyuan\.net\/(?:pcrj\/|Android\/\d+\.html)/.test(location.href) ) { // 求资源网
        var filetit = document.querySelector("div.filetit");
        for (var a of filetit.children) {
            //   console.log(a);
            if (a.href) {
                var result = url_regexp.exec(a.innerHTML);
                if (result) a.href = result[1].startsWith("http") ? result[1] : "https://" + result[1];
            }
            if ( a.innerHTML.startsWith("90网盘：") || a.innerHTML.includes("90pan") ) {
                var dom = filetit.nextElementSibling.nextElementSibling;
                var result = /(?:90网盘：|\/\s*)(\d+)/.exec(dom.innerHTML);
                if (result) a.href += "#" + result[1];
            }
        }
    }
    
    // 网盘自动填写密码
    let YunDisk = {
        sites: {
            "pan.baidu.com": { // 百度云
                inputSelector: "#accessCode",
                buttonSelector: "#submitBtn", 
                regStr: "[a-z\\d]{4}",
                timeout: 0,
                clickTimeout: 0
            },
            
            "eyun.baidu.com": { // 百度企业网盘
                inputSelector: "input.share-access-code",
                buttonSelector: "a.g-button",
                regStr: "[a-z\\d]{4}",
                timeout: 10,
                clickTimeout: 10
            },
            
            "cloud.189.cn": { // 天翼云
                inputSelector: "#code_txt",
                buttonSelector: "a.btn-primary", 
                regStr: "[a-z\\d]{4}",
                timeout: 10,
                clickTimeout: 500
            },
            
            "lanzou.com": { // 蓝奏云
                inputSelector: "#pwd",
                buttonSelector: "#sub, .passwddiv-btn", 
                regStr: "[a-z\\d]{2,8}",
                timeout: 10,
                clickTimeout: 10
            }, 
            
            "n802.com": { // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 10,
                clickTimeout: 500
            },
            
            "306t.com": { // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 10,
                clickTimeout: 500
            },
            
            "089u.com": { // 城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 800,
                clickTimeout: 500
            },
            
            "ct.ghpym.com": { // 果核城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 500,
                clickTimeout: 500
            },
            
            "474b.com": { // 爱之语城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 500,
                clickTimeout: 500
            },
            
            "590m.com": { // 小众软件城通网盘
                inputSelector: "#passcode",
                buttonSelector: "button.btn-primary", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 500,
                clickTimeout: 500
            },
            
            "www.90pan.com": { // 90网盘
                inputSelector: "#code",
                buttonSelector: "button.btn-info", 
                regStr: "[a-z\\d]{4, 6}",
                timeout: 10,
                clickTimeout: 500
            },
            
            "vdisk.weibo.com": { // 微盘
                // include: ["vdisk.weibo.com/lc"],
                inputSelector: "#keypass",
                buttonSelector: "div.search_btn_wrap>a", 
                regStr: "[a-z\\d]{4}",
                timeout: 100,
                clickTimeout: 10
            },
            
            "pan.xunlei.com": { // 迅雷云盘
                inputSelector: "input.td-input__inner",
                buttonSelector: "button.td-button", 
                // regExp: /^[a-z\d]{4}$/i,
                regStr: "[a-z\\d]{4}",
                timeout: 1500,
                clickTimeout: 10,
                store: true,
                inputEvent: true
            },
            
            "share.weiyun.com": { // 微云
                inputSelector: "input.input-txt",
                buttonSelector: "button.btn-main", 
                regStr: "[a-z\\d]{4,6}",
                timeout: 1000,
                clickTimeout: 10, 
                inputEvent: true
            },
            
            "115.com": { // 115网盘
                inputSelector: "input.text",
                buttonSelector: "a.btn-large", 
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                clickTimeout: 10,
                inputEvent: true
            },
            
            "quqi.com": { // 曲奇云
                inputSelector: "div.webix_el_box>input",
                buttonSelector: "button.webixtype_base", 
                regStr: "[a-z\\d]{6}",
                timeout: 600,
                clickTimeout: 10,
            },
            
            "caiyun.139.com": { // 和彩云
                inputSelector: "input",
                buttonSelector: "a.btn-token", 
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                clickTimeout: 10,
                inputEvent: true,
                store: true
            },
            
            "mo.own-cloud.cn": { // 小麦魔方
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root", 
                regStr: "[a-z\\d]{4,8}",
                timeout: 500,
                clickTimeout: 10,
                store: true,
                react: true
            },
            
            "cloud.qingstore.cn": { // 清玖云
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root", 
                regStr: "[a-z\\d]{4}",
                timeout: 500,
                clickTimeout: 10,
                store: true,
                react: true
            },
            
            "pan.mebk.org": { // 马恩资料库云盘
                inputSelector: "#pwd",
                buttonSelector: "button.MuiButton-root", 
                regStr: "[a-z\\d]{6}",
                timeout: 500,
                clickTimeout: 10,
                store: true,
                react: true
            },
            
            "mega.nz": {
                regExp: /^[a-z\d\-_]{22}$/i
            },

        },
        
        // 自动填写密码并点击跳转
        autoFill: function(host) {
            let site = this.sites[host];
            if (site.inputSelector) {
                setTimeout(function() {
                    let input = document.querySelector(site.inputSelector);
                    let button = document.querySelector(site.buttonSelector);
                    let code = null;
                    if (input) {
                        if (site.store) code = GM_getValue(host);
                        else code = location.hash.slice(1);
                        if (code) {
                            let regExp = new RegExp("^" + site.regStr + "$", "i");
                            if ( regExp.test(code) ) {
                                if (site.inputEvent) {
                                    let t=setInterval(function() {
                                        input.focus()
                                        input.value = code;
                                        if(input.value !== '') {
                                            if(typeof(InputEvent)!=='undefined') {
                                                //使用 InputEvent 方法，主流浏览器兼容
                                                input.dispatchEvent(new InputEvent("input")); //模拟事件
                                            } else if(KeyboardEvent) {
                                                //使用 KeyboardEvent 方法，ES6以下的浏览器方法
                                                input.dispatchEvent(new KeyboardEvent("input"));
                                            }
                                            clearInterval(t);
                                            input.blur()
                                            button.dispatchEvent(new MouseEvent("click"));
                                        }
                                    }, 1000);
                                } else if (site.react) {
                                    let event = new Event('input', { bubbles: true });
                                    let lastValue = input.value
                                    input.value = code;
                                    let tracker = input._valueTracker;
                                    if (tracker) tracker.setValue(lastValue);
                                    input.dispatchEvent(event);
                                    setTimeout( () => button.click(), site.clickTimeout );
                                }
                            else {
                                    input.value = code;
                                    setTimeout( () => button.click(), site.clickTimeout );
                                }
                            } else console.log("未找到提取码!");
                        } else console.log("无需提取码!");
                    } else console.log(`input: ${input}`); // showNotice(`input: ${input}`);
                }, site.timeout);
            }
        },
        
        // 映射域名
        mapHost: function(host) {
            return host.replace(/.*lanzou[isx]?.com/, "lanzou.com").replace(/quqi\.\w+\.com/, 'quqi.com');
        },
        
        addCode2: function(a) {
            let site = this.sites[this.mapHost(a.host)];
            let regExp = new RegExp("^" + site.regStr + "$", "i");
            if ( !regExp.test( a.hash.slice(1) ) ) {
                let reg = new RegExp( "(?:提[取示]|访问|查阅|密\\s*|艾|Extracted-code|\\skey)[码碼]?\\s*[:： （(]?\\s*(" + site.regStr + ")|^\\s*[:： （(]?\\s*(" + site.regStr + ")$", "i" );
                let code = reg.exec(a.textContent);
                for ( let i = 10, current = a; !code && i > 0; i--, current = current.parentElement ) {
                    let next = current;
                    while (!code) {
                        console.log(next);
                        next = next.nextSibling;
                        if (!next || next.href) break;
                        else code = reg.exec(next.textContent);
                    }
                }
                let store = this.sites[this.mapHost(a.host)].store;
                if (code) {
                    let c = code[1] || code[2];
                    if (store) GM_setValue( this.mapHost(a.host), c );
                    else if (location.host.includes("zhihu.com")) {
                        let span = document.createElement("span");
                        span.classList.add("invisible");
                        span.innerText = "#" + c;
                        a.appendChild(span);
                    }
                    else a.hash = c;
                }
                else {
                    if (store) GM_deleteValue( this.mapHost(a.host) );
                    console.log("找不到code!");
                }
            }
        },
    
    };
    
    let dealedHost = YunDisk.mapHost(location.host);
    if ( YunDisk.sites[dealedHost] ) YunDisk.autoFill(dealedHost);
    
    else {
        
        let RedirectPage = {
            sites: {
                "show.bookmarkearth.com": { // 书签地球
                    include: "http://show.bookmarkearth.com/view/",
                    selector: "a.open-in-new-window",
                },
                
                "t.cn": { // 微博
                    include: "http://t.cn/",
                    selector: "a.m-btn-orange",
                },
                
                "sunbox.cc": { // 阳光盒子
                    include: "https://sunbox.cc/wp-content/themes/begin/go.php?url=",
                    selector: "a.alert-btn",
                },
                
                "www.itdaan.com": { // 开发者知识库
                    include: "https://www.itdaan.com/link/",
                    selector: "a.c-footer-a1"
                },
                
            },
            
            // 获取真实链接并跳转
            redirect: function(host) {
                let site = this.sites[host];
                let node = document.querySelector(site.selector);
                if (node) location.href = node.href;
            },
            
            // 维基百科及镜像
            "wiki": function() {
                let isZh = location.host.includes("zh");
                let jumpToZh = GM_getValue("jumpToZh", true);
                let a = document.querySelector('a.interlanguage-link-target[lang="zh"]');
                let lastHref = null;
                if (!isZh) {
                    lastHref = location.href;
                    if (jumpToZh) {
                        history.pushState(null, null, lastHref);
                        if (a) location.href = a.href;
                        else showNotice("没有找到中文页面!"); // console.log("没有找到中文页面!");
                    }
                }
                
                // 注册菜单项控制是否自动切换中文
                let menuID = GM_registerMenuCommand(`${jumpToZh?"[✔]":"[✖]"}自动切换中文`, autoJump);

                function autoJump() {
                    jumpToZh = !jumpToZh;
                    GM_setValue("jumpToZh", jumpToZh);
                    GM_unregisterMenuCommand(menuID);
                    menuID = GM_registerMenuCommand(`${jumpToZh?"[✔]":"[✖]"}自动切换中文`, autoJump);
                    if (!isZh && jumpToZh) {
                        if (a) location.href = a.href;
                        else showNotice("没有找到中文页面!");
                    } else history.back();
                }
            },
            
            // Mozilla开发者页面
            "mozilla": function() {
                let isZh = location.pathname.includes("zh-CN");
                let jumpToZh = GM_getValue("jumpToZh", true), lastHref = null;
                let options = document.querySelectorAll("#select_language>option");
                if (!isZh) {
                    if (jumpToZh) {
                        for (let i = options.length - 1; i > 0; i--) {
                            if ( options[i].value.startsWith("/zh-CN") ) {
                                lastHref = options[i].value;
                                break;
                            }
                        }
                        if (lastHref) {
                            location.href = lastHref;
                        } else showNotice("没有找到中文页面!");
                    }
                }
                
                // 注册菜单项控制是否自动切换中文
                let menuID = GM_registerMenuCommand(`${jumpToZh?"[✔]":"[✖]"}自动切换中文`, autoJump);

                function autoJump() {
                    jumpToZh = !jumpToZh;
                    GM_setValue("jumpToZh", jumpToZh);
                    GM_unregisterMenuCommand(menuID);
                    menuID = GM_registerMenuCommand(`${jumpToZh?"[✔]":"[✖]"}自动切换中文`, autoJump);
                    if (!isZh && jumpToZh) {
                        for (let i = options.length - 1; i > 0; i--) {
                            if ( lastHref = options[i].value, lastHref.startsWith("/zh-CN") ) break;
                        }
                        if (lastHref) location.href = lastHref;
                        else showNotice("没有找到中文页面!");
                    } else history.back();
                }
            },
        };
        
        // 跳转页面
        if ( RedirectPage.sites[location.host] ) RedirectPage.redirect(location.host);
        // 维基百科及镜像页面
        else if ( location.host.match(/.+wiki(?:\.sxisa|pedia)\.org/) ) RedirectPage["wiki"]();
        
        // 点击元素(文本或链接)
        else {
            // Mozilla开发者页面
            if ( location.host == "developer.mozilla.org") RedirectPage["mozilla"]();
            
            // 页面监听
            document.addEventListener("mousedown", function(clickObj) {
                let e = clickObj.target ?? clickObj.originalTarget, isTextToLink;
                if (e && !e.href) { // 非链接
                    let flag = true;
                    for ( let current = e, limit = 5; current.localName !== "body" && limit > 0; current = current.parentElement, limit-- ) {
                        if (current.localName === "a") {
                            e = current;
                            break;
                        } else if ( ["code", "pre"].some( tag => tag === current.localName) ) {
                            flag = false;
                            break;
                        }
                    }
                    if (e.localName !== "a" && flag) {
                        let node = clickObj.explicitOriginalTarget;
                        if (node.nodeValue) e = text2Link(node);
                        else 
                            e = textToLink(e);
                        if (e) isTextToLink = true;
                    }
                }
                if (e && e.localName === "a") { // 链接
                    let a = e;
                    if ( location.href.includes('mod.3dmgame.com/mod/') ) { // mod.3dmgame.com
                        a.search = '3dmgame.com';
                    }

                    if ( isLinkText(a) ) { // 链接文本为真实链接
                        if ( url_regexp.test(a.innerText) ) a.href = a.innerText.startsWith("http") ? a.innerText : "https://" + a.innerText; 
                    }
                    // 含真实链接的跳转链接
                    cleanRedirectLink(a);
                    
                    if ( a.host.includes("wikipedia.org") ) { // 维基百科
                        a.href = a.href.replace("wikipedia.org", "wiki.sxisa.org");
                    } else if ( a.host.includes("developers.google.com") ) { // 谷歌开发者
                        a.href = a.href.replace("developers.google.com", "developers.google.cn")
                    } else if (YunDisk.sites[YunDisk.mapHost(a.host)]) { // 网盘
                        YunDisk.addCode2(a);
                        if (isTextToLink) a.click();
                    }
                    add_blank(a);
                }
            });
            
            
            // 文本字数限制
            let textLength = GM_getValue("textLength", 200);
            // 注册菜单项限制文本字数
            /*let menuID = GM_registerMenuCommand(`设置文本字数限制(${textLength})`, limitText);
            
            function limitText() {
                let input = prompt("请输入文本字数限制: ", GM_getValue("textLength", 200));
                if (+input) {
                    GM_setValue("textLength", +input);
                    GM_unregisterMenuCommand(menuID);
                    menuID = GM_registerMenuCommand(`设置文本字数限制(${+input})`, limitText);
                }
            }*/
            
            // 文本转链接
            function textToLink(e) {
                // console.log(e);
                if ( !["body", "code", "pre"].some( tag => tag === e.localName) && !["www.google"].some( h => location.host.includes(h) ) ) {
                    let span = null, count = 0;
                    for (let i = e.childNodes.length-1, limit = 10; i >= 0 && limit > 0; i--) {
                        let child = e.childNodes[i];
                        if ( !["a", "br", "code", "pre", "img", "script"].some( tag => tag === child.localName ) // 剔除遍历节点类型
                            && child.className !== "textToLink"
                            && child.textContent.length < textLength ) { // 限制文本字数
                            let result = url_regexp.exec(child.textContent);
                            if ( result && !result[0].includes("@") ) {
                                span = document.createElement("span");
                                span.className = "textToLink";
                                span.innerHTML = child.textContent.replace(url_regexp,
                                                                 result[0].startsWith("http")
                                                                 ? '<a href="$1" target="_blank">$1</a>'
                                                                 : '<a href="https://$1" target="_blank">$1</a>');
                                child.parentNode.replaceChild(span, child);
                                count++;
                            }
                            limit--;
                        }
                    }
                    
                    return count == 1 && (span && span.firstElementChild);
                }
            }
            
            function text2Link(node) {
                let result = url_regexp.exec(node.nodeValue), span = null;
                if ( result  && !result[0].includes("@")) {
                    span = document.createElement("span");
                    span.className = "textToLink";
                    span.innerHTML = node.nodeValue.replace(url_regexp,
                                                     result[0].startsWith("http")
                                                     ? '<a href="$1" target="_blank">$1</a>'
                                                     : '<a href="https://$1" target="_blank">$1</a>');
                    node.parentNode.replaceChild(span, node);
                }
                return span && span.firstElementChild;
            }
            
            // 链接文本为真实链接
            function isLinkText(a) {
                let keywords = ["www.sunweihu.com/go/?url=", "jump.bdimg.com/safecheck/index?url=", "jump2.bdimg.com/safecheck/index?url=", "zhouxiaoben.info/wp-content/themes/begin/go.php?url="];
                return keywords.some( k => a.href.includes(k) );
            }
            
            let excludeSites = GM_getValue("excludeSites", ["v.qq.com", "v.youku.com", "blog.csdn.net", "cloud.tencent.com", "translate.google.com",
                                                            "domains.live.com", "passport.yandex.ru", "www.iconfont.cn", "baike.sogou.com", "www.kdocs.cn",
                                                            "help.aliyun.com", "cn.bing.com", "service.weibo.com"]);   
            // 注册菜单项添加例外域名
            GM_registerMenuCommand("添加例外域名", addExcludeSite);

            // 添加例外域名
            function addExcludeSite() {
                let input = prompt("输入的域名下的链接不会被净化: ", location.host);
                if (input) {
                    if ( /[\w]+(\.[\w]+)+/.test(input) ) {
                        if ( !excludeSites.some( s => s.includes(input) ) ) {
                            excludeSites.push(input);
                            GM_setValue("excludeSites", excludeSites);
                        }
                        else showNotice(`例外域名 <${input}> 已存在!!!`);
                    }
                    else showNotice(`<${input}> 不是有效域名!!!`);
                }
            }
            function cleanRedirectLink(a) { // 净化跳转链接
                let reg = /((?:http|https|\/|\%2F).*?\?.+?=)((?:http|\/|\%2F).+|([\w]+(?:(?:\.|%2E)[\w]+)+))/;
                let result = reg.exec(a.href);
                if (result) {
                    let temp = decodeURIComponent( decodeURIComponent(result[2]) );
                    if (!(
                         decodeURIComponent(location.href).includes(temp.split("&")[0]) ||
                         ( result[3] && result[3].includes(location.host) ) ||
                         excludeSites.some( s => result[1].includes(s) ) ||
                         YunDisk.sites[YunDisk.mapHost(a.host)]
                       )) {
                        let href = decodeURIComponent(decodeURIComponent(result[3] ? 
                                                                         "http://" + result[3] : 
                                                                         result[2].startsWith("http") ? 
                                                                         result[2] : 
                                                                         location.origin + result[2]) );
                        if (a.title) a.title += "\n" + decodeURIComponent(a.href);
                        else a.title = decodeURIComponent(a.href);
                        a.href = href;
                    }
                }
            }
            
            let defaultTargetSites = GM_getValue("defaultTargetSites", []);
            let isAddBlank = GM_getValue("isAddBlank", false);
            let isDefault = defaultTargetSites.some( s => s == location.host );
            // 注册菜单项该站链接保持默认打开方式
            if (!isDefault) {
                let menuID2 = GM_registerMenuCommand("该站链接保持默认打开方式", function() {
                    defaultTargetSites.push(location.host);
                    GM_setValue("defaultTargetSites", defaultTargetSites);
                    isDefault = defaultTargetSites.some( s => s == location.host)
                    GM_unregisterMenuCommand(menuID2);
                    GM_unregisterMenuCommand(menuID);
                });
                
                // 注册菜单项启停在新标签打开链接
                let menuID = GM_registerMenuCommand(`${isAddBlank?"[✔]":"[✖]"}在新标签打开链接`, addBlank);

                // 启停在新标签打开链接
                function addBlank() {
                    isAddBlank = !isAddBlank;
                    GM_setValue("isAddBlank", isAddBlank);
                    GM_unregisterMenuCommand(menuID);
                    menuID = GM_registerMenuCommand(`${isAddBlank?"[✔]":"[✖]"}在新标签打开链接`, addBlank);
                }
            }
            
            // 给链接添加[target="_blank"]属性
            function add_blank(a) {
                if (isAddBlank && !isDefault) {
                    let result = a.target == "_blank" ||
                                 /javascript[\w:;()]+/.test(a.href) ||
                                 /\/\w+-\d+-\d+\.html|.+page\/\d+|category-\d+_?\d*/.test(a.href) || /[前后上下首末].+[页篇张]|^\d+$|^next$|^previous$/i.test(a.innerText) || ["prev", "next"].some(r => r == a.attributes.rel?.nodeValue) ||
                                 !/^(?:http|\/\/).+/.test(a.attributes.href.nodeValue) ||
                                 a.href == (location.origin + "/") ||
                                 a.href.endsWith(".user.js");
                    // 移除卡饭帖子链接的点击事件
                    if (a.href.includes("https://bbs.kafan.cn/thread")) a.onclick = null;
                    if (!result) a.target = "_blank";
                }                
            }
        }
    }
    
}();