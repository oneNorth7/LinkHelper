# 链接助手

## 主要功能

1. 点击网盘链接或网盘链接文本（会自动转成链接），自动搜索密码，跳转后自动填写密码并提交

   支持网盘列表：[百度云](https://pan.baidu.com)、[百度企业网盘](https://eyun.baidu.com)、[天翼云](https://cloud.189.cn)、[蓝奏云](https://www.lanzou.com)、[微盘](https://vdisk.weibo.com)、[微云](https://share.weiyun.com)、[迅雷云盘](https://pan.xunlei.com)、[115网盘](http://115.com)、[和彩云](https://caiyun.139.com)、[曲奇云](https://quqi.com)、[小麦魔方](https://mo.own-cloud.cn)、[清玖云](https://cloud.qingstore.cn)、[马恩资料库云盘](https://pan.mebk.org)、[90网盘](https://www.90pan.com)、部分城通网盘

2. 跳转页面自动跳转（微博短链、书签地球、阳光盒子、开发者知识库）

3. 点击链接文本自动转成链接，默认不会自动跳转（支持的网盘链接除外）

4. 净化跳转链接，点击链接时将链接中的**真实链接**替换原链接（可添加例外）

5. 维基百科及镜像、Mozilla开发者自动切换中文（可控）， 点击维基百科、谷歌开发者链接自动转换为镜像链接

6. 新标签打开链接（可控，可添加站点白名单）

## 其他说明

* 网盘自动填写密码功能**不支持云查询密码**，也不记录密码，只会在个别网盘链接不支持添加hash时将密码临时存储在脚本的数据页中
* 论坛帖子中分开格式化的链接文本不能转换为完整链接
* 添加例外域名菜单是针对净化跳转链接功能设置的，添加后含该域名的链接不会被净化
* 在新标签打开链接功能有相关菜单项可打开/关闭（默认关闭），可针对特定站点关闭（该站链接保持默认打开方式），翻页链接、相对链接、锚点链接保持原有打开方式
* 脚本默认不支持对<iframe>页面进行注入，如果需要注入<iframe>页面，可以将脚本头部声明中的 `@noframes` 一行删除掉后保存

## 更新历史

* 2021/3/14-V1.2.9    脚本`run-at`参数由`document-body`改为`document-end`；优化翻页按钮匹配规则; 优化磁力链接文本转链接功能
* 2021/3/12-V1.2.8    更新论坛帖子链接匹配规则，移除论坛帖子链接的`onclick`点击事件；更新文本转链接的正则表达式(支持磁力链接和e2dk)
* 2021/3/10-V1.2.7    更新密码匹配规则；将鼠标事件改为弹起事件以支持文本选中；新增代码块(`<code>`和`<pre>`标签对下)选中文本后转链接功能

* 2021/3/7-V1.2.6     更新Mozilla开发者自动切换中文的选择器

## 功能演示

![网盘自动填写密码](https://gitee.com/oneNorth7/pics/raw/master/picgo/网盘自动填写密码.gif)

## 参考脚本

* [Open the F**king URL Right Now ](https://greasyfork.org/zh-CN/scripts/412612-open-the-f-king-url-right-now)
* [知乎真实链接地址重定向](https://greasyfork.org/zh-CN/scripts/20431-zhihu-link-redirect-fix)
* [Text To link](https://greasyfork.org/zh-CN/scripts/342-text-to-link)
* [网盘自动填写访问码【威力加强版】](https://greasyfork.org/zh-CN/scripts/29762-%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88)

## 个人公众号

![一个北七](https://gitee.com/oneNorth7/pics/raw/master/picgo/一个北七.png)

如果觉得实用的话**敬请关注**一波个人公众号~