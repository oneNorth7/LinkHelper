# [链接助手](https://github.com/oneNorth7/LinkHelper)

![link-helper](https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png)

## 重大更新

* 全新重构版本，兼容**PC端Firefox、Chrome、Edge**三大主流浏览器，逐一通过各项功能测试；国产浏览器大多基于 [Chromium](https://www.chromium.org/) 开源项目二次开发，理应兼容

## 主要功能

1. 点击网盘链接或网盘链接文本（会自动转成链接），自动搜索密码，跳转后自动填写密码并提交

   支持网盘列表：[百度云](https://pan.baidu.com)、[百度企业网盘](https://eyun.baidu.com)、[天翼云](https://cloud.189.cn)、[蓝奏云](https://www.lanzou.com)、[微盘](https://vdisk.weibo.com)、[微云](https://share.weiyun.com)、[迅雷云盘](https://pan.xunlei.com)、[115网盘](http://115.com)、[和彩云](https://caiyun.139.com)、[曲奇云](https://quqi.com)、[小麦魔方](https://mo.own-cloud.cn)、[清玖云](https://cloud.qingstore.cn)、[马恩资料库云盘](https://pan.mebk.org)、[90网盘](https://www.90pan.com)、部分城通网盘

2. 跳转页面自动跳转（微博短链、书签地球、阳光盒子、开发者知识库、CSDN 等等）

3. 点击链接文本自动转成链接（支持http链接、磁力链接、邮箱链接），默认不会自动跳转（支持的网盘链接除外）

4. 净化跳转链接，点击链接时将链接中的**真实链接**替换原跳转链接（可添加例外）

5. 维基百科及镜像、Mozilla开发者自动切换中文（可控），点击维基百科、谷歌开发者链接自动转换为镜像链接并跳转

6. 新标签打开链接（默认关闭，可控，可添加站点白名单）

## 其他说明

* 网盘自动填写密码功能**不支持云查询密码**，也不记录密码，只会在个别网盘链接不支持添加hash时将密码临时存储在脚本的数据页中

* 论坛帖子中分开格式化的链接文本不能转换为完整链接

* 添加例外域名菜单是针对净化跳转链接功能设置的，添加后含该域名的链接不会被净化

* 在新标签打开链接功能有相关菜单项可打开/关闭（默认关闭），可针对特定站点关闭（该站链接保持默认打开方式），翻页链接、相对链接、锚点链接保持原有打开方式

* 脚本默认不支持对`<iframe>`页面进行注入，如果需要注入`<iframe>`页面，可以将脚本头部声明中的 `@noframes` 一行删除掉后保存

* **由于Firefox和Chrome鼠标事件对象的差异，Firefox可以精准获取点击的文本节点，而Chrome做不到，故文本转链接功能在这两款浏览器上的功能表现会有所不同**；

* Chrome系浏览器中点击谷歌应用商店链接会弹出询问`是否跳转镜像站`的确认框，跳转后如果出现`404`说明该镜像站可能没有对应的扩展，可返回尝试输入扩展名称进行搜索

  ![是否跳转到www.crx4chrome.com镜像站](https://gitee.com/oneNorth7/pics/raw/master/picgo/是否跳转到www.crx4chrome.com镜像站.jpg)

  ![404 not found](https://gitee.com/oneNorth7/pics/raw/master/picgo/404-not-found.jpg)


## 更新历史

* V1.6.0 - 新增`gopojie`下载页面预处理功能；优化净化链接的正则匹配规则

* V1.5.1 ~ V1.5.9 - 移除NGA玩家社区外链访问提醒；优化和彩云自动填写密码功能；优化净化跳转链接功能；新增Chrome系浏览器中谷歌应用商店链接转镜像站`www.crx4chrome.com`功能

## 功能演示

![网盘自动填写密码](https://gitee.com/oneNorth7/pics/raw/master/picgo/网盘自动填写密码.gif)

## 参考脚本

* [Open the F**king URL Right Now ](https://greasyfork.org/zh-CN/scripts/412612-open-the-f-king-url-right-now)
* [知乎真实链接地址重定向](https://greasyfork.org/zh-CN/scripts/20431-zhihu-link-redirect-fix)
* [Text To link](https://greasyfork.org/zh-CN/scripts/342-text-to-link)
* [网盘自动填写访问码【威力加强版】](https://greasyfork.org/zh-CN/scripts/29762-%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88)

## 个人公众号

![一个北七](https://gitee.com/oneNorth7/pics/raw/master/picgo/一个北七.png)

**敬请关注**一波个人公众号`~~~`

**第一时间**获取更新推送！！！