# [链接助手](https://github.com/oneNorth7/LinkHelper)

![link-helper](https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png)

## 重大更新

* 全新重构版本，兼容**PC端Firefox、Chrome、Edge**三大主流浏览器，逐一通过各项功能测试；国产浏览器大多基于 [Chromium](https://www.chromium.org/) 开源项目二次开发，理应兼容
* 扩充自动填写密码的网盘支持列表，囊括**大部分主流网盘及小众网盘**（持续更新中，欢迎反馈新的需要自动填写密码的云盘）

## 主要功能

1. 点击网盘链接或网盘链接文本（会自动转成链接），**部分网盘**可自动搜索密码，跳转后自动填写密码并提交

   支持网盘列表：

   * [奶牛快传](cowtransfer.com)、[电脑小分享](drive.dnxshare.cn)、[爱盘](down.52pojie.cn)、[云中转](www.yunzhongzhuan.com)、[OneDrive](my.sharepoint.com)、[GoogleDrive](drive.google.com)、[MEGA](mega.nz)、[MediaFire](www.mediafire.com)、[一起写](yiqixie.qingque.cn)、[AndroidDownload](www.androiddownload.net)、[Dropbox](www.dropbox.com)、[库云](www.kufile.net)、[YandexDisk](disk.yandex.com)
   * 自动填写密码: [百度云](https://pan.baidu.com)、[百度企业网盘](https://eyun.baidu.com)、[天翼云](https://cloud.189.cn)、[蓝奏云](https://www.lanzou.com)、[微盘](https://vdisk.weibo.com)、[微云](https://share.weiyun.com)、[迅雷云盘](https://pan.xunlei.com)、[115网盘](http://115.com)、[和彩云](https://caiyun.139.com)、[曲奇云](https://quqi.com)、[360安全云盘](https://yunpan.360.cn)、[超星云盘](https://pan-yz.chaoxing.com)、[文叔叔](https://www.wenshushu.cn)、[坚果云](https://www.jianguoyun.com)、[闪电盘](https://shandianpan.com)、[小麦魔方](https://mo.own-cloud.cn)、[萌云|清玖云](https://cloud.qingstore.cn)、[ME Drive云盘](https://pan.mebk.org)、[小太阳云存储](https://cncncloud.com)、[比邻云盘](https://pan.bilnn.com)、[信爱云](https://ilolita945.softether.net:5212)、[my-file](https://my-file.cn)、[gofile](https://gofile.me)、[90网盘](https://www.90pan.com)、部分城通网盘

2. 跳转页面自动跳转（[微博短链](t.cn)、[书签地球](http://show.bookmarkearth.com/view/784?folderId=45371)、[阳光盒子](https://sunbox.cc/wp-content/themes/begin/go.php?url=aHR0cHM6Ly9naXRodWIuY29tL0N5ZW5vY2gvRmx1dHRlci1Db29sYXBrL3JlbGVhc2Vz)、[开发者知识库](https://www.itdaan.com/link/aHR0cDovL3d3dy5maWxlc29uaWMuY29tL2ZpbGUvMTY5NjYwNzc2MQ==)、[CSDN](https://link.csdn.net/?target=https%3A%2F%2Fgreasyfork.org%2Fzh-CN)、[不死鸟](https://niao.su/go/aHR0cDovL2NyeGRvd24uY29t)、[也许吧](https://www.imaybes.cc/wl?url=zqms0diflZDTp8XZZ5el0Q,,) 等等）

3. 点击链接文本自动转成链接（支持**http链接、磁力链接、邮箱链接**），默认转换后**不会自动跳转**（**上述支持的网盘链接及自定义域名的链接除外**）

4. 替换跳转链接，点击链接时将**链接文本**替换原跳转链接（链接文本前缀为未收录时会询问是否替换或取消）

5. 净化跳转链接，点击链接时移除域名后缀（部分站点支持），将链接中的**真实链接**替换原跳转链接（可添加例外）

6. 维基百科及镜像、Mozilla开发者、MicroSoft开发者、谷歌商店自动切换中文（可控）；点击维基百科、谷歌开发者链接自动转换为镜像链接并跳转，点击谷歌扩展商店链接时询问是否切换为镜像链接（默认开启，身处国外或自备梯子的用户可自行关闭）

7. 新标签打开链接（默认关闭，可控，可添加站点白名单）

8. 自定义添加链接文本转链接后自动跳转域名

9. 链接净化直达输入框（默认显示，可通过菜单项关闭）

## 虽然移除重定向很方便，但是网络环境复杂，使用前请仔细确认站点可信度和链接安全性！！！

## 其他说明

* 网盘自动填写密码功能**不支持云查询密码**，也**不记录密码**，只会在个别网盘链接**不支持添加hash或`password`参数**时将密码**临时**存储在脚本的数据页中

* 博客或论坛帖子中**分开格式化**的链接文本**无法**转换为完整链接；文本长度超过200个字符的文本不会进行文本转链接的处理

* 添加例外域名菜单是针对净化跳转链接功能设置的，添加后含该域名的链接不会被净化

* 在新标签打开链接功能有相关菜单项可打开/关闭（默认关闭），可针对特定站点关闭（该站链接保持默认打开方式），**翻页链接、相对链接、锚点链接**保持原有打开方式

* 脚本默认不支持对`<iframe>`页面进行注入，如果需要注入`<iframe>`页面，可以将脚本头部声明中的 `@noframes` 一行删除掉后保存

* **由于Firefox和Chrome鼠标事件对象的差异，Firefox可以精准获取点击的文本节点，而Chrome做不到，故文本转链接功能在这两款浏览器上的功能表现会有所不同**

* Chrome系浏览器中点击谷歌应用商店链接会弹出询问`是否跳转镜像站`的确认或取消的提示，跳转后如果出现`404`说明该镜像站可能没有对应的扩展，可返回尝试输入扩展名称进行搜索

  ![是否跳转到www.crx4chrome.com镜像站_new](https://gitee.com/oneNorth7/pics/raw/master/picgo/是否跳转到www.crx4chrome.com镜像站_new.jpg)
  
  ![404 not found](https://gitee.com/oneNorth7/pics/raw/master/picgo/404-not-found.jpg)
  
* 使用链接净化直达输入框时，点击图标可**展开/收起**输入框，鼠标离开**5秒**后会自动收起，收起时会清空输入框内容；粘贴的网盘链接**提取码后面不要含过多的无关文本**，否则可能导致无法解析出提取码，文本内的链接数大于1时不会自动跳转，链接间的中文（标点）字符可被过滤掉

## 更新历史

* V1.7.7 - 修复输入框和文本框内文本转链接的问题

* V1.7.6 - 修复链接直达文本框定位问题；新增显示链接直达输入框开关

* 新增网盘支持（完整列表请参考主要功能说明）
* V1.7.5 - 新增链接净化直达文本框；将蓝奏云域名中的lanzous替换为lanzoux
* V1.7.4 - 新增更新配置数据功能；新增谷歌扩展商店自动切换中文功能
* V1.7.3 - 优化链接文本与链接比较的判断逻辑；优化password添加密码方式；新增自定义添加链接文本转链接后自动跳转域名功能；新增自动切换镜像开关和域名判断
* V1.7.2 - 优化链接正则匹配规则；修复净化链接后缀功能的判断问题
* V1.7.1 - 优化链接净化功能的匹配规则；新增移除Youtube、Twitter、Facebook链接重定向功能
* V1.7.0 - 优化115云盘自动填写密码功能；优化链接净化功能
* V1.6.9 - 优化净化链接域名后缀功能
* V1.6.8 - 调整链接文本替换链接功能和链接净化功能顺序
* V1.6.7 - 优化链接文本与链接比较规则
* V1.6.6 - 优化净化链接域名后缀参数功能
* V1.6.5 - `password`添加密码方式保留原有参数
* V1.6.4 - 优化链接净化功能的匹配规则；新增http链接域名后缀(nz, me)；优化链接文本与链接比较规则
* V1.6.3 - 新增`password`添加密码方式；新增链接替换或净化标识
* V1.6.2 - 优化链接文本替换链接和谷歌应用商店链接转镜像站的提示功能；优化链接文本转链接功能；优化Mozilla开发者自动切换中文功能
* V.16.1 - 优化链接文本替换目标链接功能
* V1.6.0 - 新增`gopojie`下载页面预处理功能；优化净化链接的正则匹配规则
* V1.5.1 ~ V1.5.9 - 移除NGA玩家社区外链访问提醒；优化和彩云自动填写密码功能；优化净化跳转链接功能；新增Chrome系浏览器中谷歌应用商店链接转镜像站`www.crx4chrome.com`功能

## 功能演示

![网盘自动填写密码](https://gitee.com/oneNorth7/pics/raw/master/picgo/网盘自动填写密码.gif)

![链接净化直达](https://gitee.com/oneNorth7/pics/raw/master/picgo/链接净化直达.gif)

## 参考脚本

* [Open the F**king URL Right Now](https://greasyfork.org/zh-CN/scripts/412612-open-the-f-king-url-right-now)
* [知乎真实链接地址重定向](https://greasyfork.org/zh-CN/scripts/20431-zhihu-link-redirect-fix)
* [Text To link](https://greasyfork.org/zh-CN/scripts/342-text-to-link)
* [网盘自动填写访问码【威力加强版】](https://greasyfork.org/zh-CN/scripts/29762-%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%BF%E9%97%AE%E7%A0%81-%E5%A8%81%E5%8A%9B%E5%8A%A0%E5%BC%BA%E7%89%88)

## 个人公众号

**敬请关注**一波个人公众号，**第一时间**获取更新推送！！！

![一个北七](https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png)