# [链接助手](https://github.com/oneNorth7/LinkHelper)

![link-helper](https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png)

## 重大更新

* 全新重构版本，兼容**PC端Firefox、Chrome、Edge**三大主流浏览器，逐一通过各项功能测试；国产浏览器大多基于 [Chromium](https://www.chromium.org/) 开源项目二次开发，理应兼容
* 扩充自动填写密码的网盘支持列表，囊括**大部分主流网盘及小众网盘**（持续更新中，**欢迎反馈**新的需要自动填写密码的云盘）
* **目前唯一支持阿里云盘自动填写密码的脚本**（官方验证机制比较繁琐，自行调试研究在Firefox下实现突破，后又多次钻研终于解决Chrome浏览器兼容问题，炫耀一下耶）

## 虽然移除重定向很方便，但是网络环境复杂，使用前请仔细确认站点可信度和链接安全性！！！

## 主要功能

1. 点击网盘链接或网盘链接文本（会自动转成链接），**部分网盘**可自动搜索密码，跳转后自动填写密码并提交，支持网盘列表如下：

    * [奶牛快传](https://cowtransfer.com)、[电脑小分享](https://drive.dnxshare.cn)、[爱盘](https://down.52pojie.cn)、[云中转](https://www.yunzhongzhuan.com)、[GoogleDrive](https://drive.google.com)、[MEGA](https://mega.nz)、[MediaFire](https://www.mediafire.com)、[一起写](https://yiqixie.qingque.cn)、[AndroidDownload](https://www.androiddownload.net)、[Dropbox](https://www.dropbox.com)、[库云](https://www.kufile.net)、[YandexDisk](https://disk.yandex.com)、[金山文档](https://www.kdocs.cn)、[比特球云盘](https://pan.bitqiu.com)、[飞猫云](https://www.feimaoyun.com)、[亿方云](https://www.fangcloud.com)、[GD DISK](https://gd.188988.xyz)、[UC网盘](https://www.yun.cn)、[语雀](https://www.yuque.com)、[石墨文档](https://shimo.im)
    * 自动填写密码: [百度云](https://pan.baidu.com)、[百度企业网盘](https://eyun.baidu.com)、[百度云文档](https://pan.baidu.com/doc)、[天翼云](https://cloud.189.cn)、[蓝奏云](https://www.lanzou.com)、[微盘](https://vdisk.weibo.com)、[微云](https://share.weiyun.com)、[迅雷云盘](https://pan.xunlei.com)、[115网盘](http://115.com)、[和彩云](https://caiyun.139.com)、[曲奇云](https://quqi.com)、[360安全云盘](https://yunpan.360.cn)、[超星云盘](https://pan-yz.chaoxing.com)、[文叔叔](https://www.wenshushu.cn)、[坚果云](https://www.jianguoyun.com)、[闪电盘](https://shandianpan.com)、[OneDrive](https://my.sharepoint.com)、[网易邮箱网盘](http://u.163.com)、[阿里云盘](https://www.aliyundrive.com)、[小麦魔方](https://mo.own-cloud.cn)、[萌云|清玖云](https://cloud.qingstore.cn)、[ME Drive云盘](https://pan.mebk.org)、[小太阳云存储](https://cncncloud.com)、[比邻云盘](https://pan.bilnn.com)、[信爱云](https://ilolita945.softether.net:5212)、[my-file](https://my-file.cn)、[玖麦云](https://bx.qingstore.cn)、[MBA网盘](https://pan.mba)、[gofile](https://gofile.me)、[90网盘](https://www.90pan.com)、部分城通网盘
2. 跳转页面自动跳转（[新浪短链](http://t.cn/RgAKoPE)、[新浪绿色上网](http://t.cn/A6qYCh4U)、[书签地球](http://show.bookmarkearth.com/view/81484)、[阳光盒子](https://sunbox.cc/wp-content/themes/begin/go.php?url=aHR0cHM6Ly9naXRodWIuY29tL0N5ZW5vY2gvRmx1dHRlci1Db29sYXBrL3JlbGVhc2Vz)、[开发者知识库](https://www.itdaan.com/link/aHR0cDovL3d3dy5maWxlc29uaWMuY29tL2ZpbGUvMTY5NjYwNzc2MQ==)、[CSDN](https://link.csdn.net/?target=https%3A%2F%2Fgreasyfork.org%2Fzh-CN)、[天眼查](http://www.tianyancha.com)、[语雀](https://www.yuque.com/r/goto?url=https%3A%2F%2Fgitee.com)、[百度贴吧](http://jump2.bdimg.com/safecheck/index?url=) 等等）
3. 点击链接文本自动转成链接（支持**http链接、磁力链接、电驴链接、迅雷链接、邮箱链接**），默认转换后**不会自动跳转**（**上述支持的网盘或文档链接、40位哈希码的磁力链接、ed2k开头的电驴链接、thunder开头的迅雷链接及自定义域名的链接除外**）
4. 替换跳转链接，点击链接时将**链接文本**替换原跳转链接（链接文本前缀为未收录时会询问是否替换或取消）
5. 净化跳转链接，点击链接时移除域名后缀（部分站点支持），将链接中的**真实链接**替换原跳转链接（可添加例外）
6. 维基百科及镜像、Mozilla开发者、MicroSoft开发者、谷歌商店自动切换中文（可控）；点击维基百科、谷歌开发者链接会自动转换为镜像链接并跳转，点击谷歌扩展商店或Github链接时询问是否切换为镜像链接（默认开启，身处国外或自备梯子的用户可自行关闭）
7. 新标签打开链接（默认关闭，可控，可添加站点白名单），磁力链接、电驴链接和迅雷链接移除新标签打开
8. 自定义添加链接文本转链接后自动跳转域名
9. 链接净化直达输入框（默认显示，可通过菜单项关闭）

## 如果觉得实用方便，麻烦收藏本脚本或关注作者！！！

## 其他说明

* 网盘自动填写密码功能**不支持云查询密码**，也**不记录密码**，只会在某些网盘链接**不支持添加hash或`password`参数**时将密码**临时**存储在脚本的数据页中

* 搜索网盘密码只能往后搜索，如果某个资源网站的网盘密码**固定**出现在网盘链接的相对位置，但无法自动添加密码或添加错误，可反馈作者添加密码**预处理**；若只是**个别**帖子由于手误或其他原因导致密码置于网盘链接之前的请勿反馈，请自行手动复制粘贴密码访问

* 博客或论坛帖子中**分开格式化**的链接文本**无法**转换为完整链接；文本长度超过200个字符的文本不会进行文本转链接的处理

* 添加例外域名菜单是针对净化跳转链接功能设置的，添加后含该域名的链接不会被净化

* 在新标签打开链接功能有相关菜单项可打开/关闭（默认关闭），可针对特定站点关闭（该站链接保持默认打开方式），**翻页链接、相对链接、锚点链接**保持原有打开方式

* 脚本默认不支持对`<iframe>`页面进行注入，如果需要注入`<iframe>`页面，可以将脚本头部声明中的 `@noframes` 一行删除掉后保存

* **由于Firefox和Chrome鼠标事件对象的差异，Firefox可以精准获取点击的文本节点，而Chrome做不到，故文本转链接功能在这两款浏览器上的功能表现会有所不同**

* Chrome系浏览器中点击谷歌应用商店链接会弹出询问`是否跳转镜像站`的确认或取消的提示，跳转后如果出现`404`说明该镜像站可能没有对应的扩展，可返回尝试输入扩展名称进行搜索
![是否跳转到www.crx4chrome.com镜像站_new](https://gitee.com/oneNorth7/pics/raw/master/picgo/是否跳转到www.crx4chrome.com镜像站_new.jpg)

![404 not found](https://gitee.com/oneNorth7/pics/raw/master/picgo/404-not-found.jpg)

* 使用链接净化直达输入框时，点击图标可**展开/收起**输入框，鼠标离开**5秒**后会自动收起，收起时会清空输入框内容；粘贴的网盘链接**提取码后面不要含过多的无关文本**，否则可能导致无法解析出提取码，文本内的链接数大于1时不会自动跳转，链接间的中文（标点）字符可被过滤掉

* 目前网上带密码的阿里云盘分享链接实在太少了，本人找到的是仅有7天有效期的，还有自动生成的加密分享文本中的密码似乎在链接前面，所以如果遇到**站外分享**的阿里云盘链接不能自动添加密码的情况，请反馈相关地址给作者进行测试和修复

* 点击Github链接会询问是否跳转到`fastgit`、`cnpmjs`或`rc1844`（随机）镜像站，该功能**仅为加速访问并浏览项目**，跳转后右下角会有相关提示，镜像站上方的主页图标和登录和注册按钮会被移除，**请不要在镜像网站登录账号，若因此造成任何损失本人概不负责**；请勿频繁访问镜像站，否则可能会触发`滥用检测机制`，需要等几分钟才能再度访问；镜像站可能会找不到某些项目，出现这种情况时可`刷新页面`随机切换为别的镜像站（若还是出现上次404的镜像站可点击`取消`后再次点击），如果三个镜像站都找不到该项目，则可能Github上也没有该项目

  ![触发滥用检测机制](https://gitee.com/oneNorth7/pics/raw/master/picgo/触发滥用检测机制.jpg)
  
  ![git镜像站404](https://gitee.com/oneNorth7/pics/raw/master/picgo/git镜像站404.jpg)

## 更新信息

* V1.9.2 - 新增百度知道百度云分享预处理功能；优化Mozilla开发者自动切换中文功能；新增随机切换Github镜像站功能

* V1.9.1 - 更新书签地球选择器；新增新浪绿色上网页面自动跳转；新增智软酷下载页面预处理功能

* V1.9.0 - 优化阿里云盘自动填写密码功能；新增点击Github链接询问是否转`fastgit`镜像链接功能

* V1.8.9 - 优化阿里云盘自动填写密码功能；新增蓝鲨下载页面网盘密码预处理功能
* V1.8.8 - 新增百度贴吧跳转页面自动跳转；优化阿里云盘自动填写密码功能，解决浏览器兼容问题；优化网盘密码搜索规则（针对阿里云盘，往前搜索密码）
* V1.8.7 - 新增UC网盘、语雀、石墨支持；百度云手机端链接自动转为电脑端链接；新增`thunder://`协议文本转链接并自动跳转；磁力链接、电驴链接和迅雷链接移除新标签打开
* V1.8.6 - 新增阿里云盘自动填写密码功能；优化链接匹配规则
* V1.8.5 - 优化链接文本与链接比较功能；新增语雀跳转页面自动跳转, 移除文中链接重定向；新增百度云文档自动填写密码
* V1.8.4 - 优化网盘密码搜索功能；修复净化磁力链接tracker的问题；优化谷歌商店自动切换中文功能
* 更早的更新历史信息请查看`update_history.md`

## 功能演示

![网盘自动填写密码](https://gitee.com/oneNorth7/pics/raw/master/picgo/网盘自动填写密码.gif)

![链接净化直达](https://gitee.com/oneNorth7/pics/raw/master/picgo/链接净化直达.gif)

![磁力链接](https://gitee.com/oneNorth7/pics/raw/master/picgo/磁力链接.gif)

![阿里云盘自动填写密码](https://gitee.com/oneNorth7/pics/raw/master/picgo/阿里云盘自动填写密码.gif)

![Github转随机镜像](https://gitee.com/oneNorth7/pics/raw/master/picgo/Github转随机镜像.gif)

![百度知道百度云分享预处理](https://gitee.com/oneNorth7/pics/raw/master/picgo/百度知道百度云分享预处理.jpg)

## 参考脚本

* [Open the F**king URL Right Now](https://greasyfork.org/zh-CN/scripts/412612-open-the-f-king-url-right-now)
* [知乎真实链接地址重定向](https://greasyfork.org/zh-CN/scripts/20431-zhihu-link-redirect-fix)
* [Text To link](https://greasyfork.org/zh-CN/scripts/342-text-to-link)
* [网盘自动填写访问码【威力加强版】](https://greasyfork.org/zh-CN/scripts/29762-%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88)
* [FastGithub 镜像加速访问、克隆和下载](https://greasyfork.org/zh-CN/scripts/397419-fastgithub-%E9%95%9C%E5%83%8F%E5%8A%A0%E9%80%9F%E8%AE%BF%E9%97%AE-%E5%85%8B%E9%9A%86%E5%92%8C%E4%B8%8B%E8%BD%BD)
* [redirect 外链跳转](https://greasyfork.org/zh-CN/scripts/416338-redirect-%E5%A4%96%E9%93%BE%E8%B7%B3%E8%BD%AC)

## 关注赞赏

**关注我，不迷路**~~ 第一时间获取更新推送！！！

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png" width=500 />

**原创不易，您的支持是我坚持创作的动力**~~

1. 可以通过[爱发电-一个北七](https://afdian.net/@oneNorth7)赞助，也可以直接扫一扫微信赞赏码哦～

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/reward_qrcode.png" width=400 />

2. 或者用支付宝扫一扫红包码或打开支付宝首页搜 `702089817` 领红包支持一下，免费让作者赚个支付宝赏金

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/红包码.jpg" width=400 />
