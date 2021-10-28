# [链接助手](https://github.com/oneNorth7/LinkHelper)

![link-helper](https://gitee.com/oneNorth7/pics/raw/master/picgo/link-helper.png)

## 功能总览

1. ✅文本转链接
2. ✅移除链接重定向
3. ✅重定向页面自动跳转
4. ✅网盘自动填写密码
5. ✅网盘密码预处理
6. ✅链接直达输入框
7. ✅自动切换镜像
8. ✅自动切换中文
9. ✅新标签打开链接
10. ✅图形化配置菜单

## 功能说明及演示

<details style="font-size: 1.5em">
<summary id="i">I. 文本转链接</summary>
<ul>
<li style="font-size: 1em">点击各类链接的文本会自动转成对应的链接，支持链接种类如下：</li>
</ul>
<ol>
<li>
<p>HTTP链接</p>
</li>
<li>
<p>邮箱链接</p>
</li>
<li>
<p>电驴链接（<code>ed2k://</code>协议）</p>
</li>
<li>
<p>迅雷链接（<code>thunder://</code>协议）</p>
</li>
<li>
<p>磁力链接（以<code>magnet:?xt=urn:btih:</code>开头或40位哈希码）</p>
</li>
<li>
<p>特殊支持：可对百度贴吧的百度网盘相对链接的文本进行补全，对各楼层和评论中使用表情符分隔的链接的文本进行处理</p>
<img alt="百度贴吧文本转链接" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/百度贴吧文本转链接.gif">
<p>默认转换后<strong>不会自动打开</strong>，但<strong>支持的网盘链接或文档链接、磁力链接、电驴链接、迅雷链接</strong>除外（文本中含<strong>多个链接</strong>时转换后<strong>只会处理第一个</strong>链接）</p>    
<img alt="磁力链接" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/磁力链接.gif">
<p>博客或论坛帖子中<strong>分开格式化</strong>的文本<strong>无法</strong>转换为完整链接；为防止误转换，文本中含其他协议（如：<code>qqdl://</code>）、秒传链接（如：<code>115://</code>）或校验信息（如：<code>SHA1</code>）的特有标识时不会进行转换</p>
</li>
</ol>
<ul>
<li style="font-size: 1em"><strong>相关配置项</strong></li>
</ul>
<ol>
<li>
<p>限制文本字符数，字符数超过设定数值（默认500，取值范围：200~800）的文本不会进行文本转链接操作
<img alt="字符数限制" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/字符数限制.gif"></p>
</li>
<li>
<p>文本转链接后全部自动打开（含有多个链接时<strong>只会自动打开第一个</strong>链接）</p>
<img alt="文本转链接后全部自动打开" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/文本转链接后全部自动打开.gif">
</li>
<li>
<p>添加或删除自动打开域名
<img alt="添加或删除自动打开域名" src="https://cdn.jsdelivr.net/gh/oneNorth7/picgo/pics/添加或删除自动打开域名.gif"></p>
</li>
<li>
<p>当前站点的文本转链接后自动打开（可添加或删除）
<img alt="添加或删除自动打开站点" src="https://cdn.jsdelivr.net/gh/oneNorth7/picgo/pics/添加或删除自动打开站点.gif"></p>
</li>
</ol>
</details>

<details style="font-size: 1.5em">
    <summary id="ii">II. 移除链接重定向</summary>
<h4 id="_4" style="color: red">温馨提示：虽然移除重定向很方便，但是网络环境复杂，使用前请仔细确认站点可信度和链接安全性！！！</h4>
<ul>
<li><p>站点出于统计、权重或安全原因会对站外链接（简称“外链”）使用重定向，这或多或少会减慢日常的网页浏览速度，为了提高浏览网页的体验，从多个方面移除链接重定向：</p></li>
</ul>
<ol>
<li>
<p>净化链接，将链接中的<strong>HTTP链接</strong>或<strong>Base64编码的HTTP链接</strong>解码后替换原跳转链接</p>
<img alt="净化链接" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/净化链接.gif">
<img alt="净化Base64链接" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/净化Base64链接.gif">
<p>该功能采用<strong>自己编写并优化</strong>的通用正则表达式进行匹配，不需要根据每个站点进行配置，只会多不会少，可能存在<strong>误净化</strong>的问题，遇到时可通过配置菜单项<strong>添加</strong><code>例外域名</code>，添加后含该域名的链接不会被净化；<strong>为方便更多人建议提交反馈</strong>给作者进行修复</p>
</li>
<li>
<p>替换链接，使用<strong>链接文本</strong>替换原跳转链接</p>
<p>此功能是针对<strong>链接文本</strong>是<strong>HTTP链接</strong>，但链接的<code>href</code>属性是<strong>加密编码链接</strong>（如：百度贴吧的链接），已收录的链接前缀会直接使用<strong>HTTP链接文本</strong>替换原链接，未收录的会触发<code>是否使用链接文本替换目标链接后打开？</code>的询问确认，选择<code>是</code>后<strong>符合特征</strong>的链接前缀会<strong>自动收录</strong>（仅存在当前脚本的数据页中），下次遇到含此前缀的链接会自动使用<strong>HTTP链接文本</strong>替换原链接</p>
<img alt="替换链接" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/替换链接.gif">
<p>如果存在误替换或不应该提示替换的情况，可以通过配置菜单项<strong>添加</strong><code>例外域名</code>，添加后含该域名的链接不会被替换或提示替换</p>
</li>
<li>
<p>特殊支持</p>
<p>CSDN移除外链安全性检验
<img alt="CSDN移除链接安全性检验" src="https://cdn.jsdelivr.net/gh/oneNorth7/picgo/pics/CSDN移除链接安全性检验.gif"></p>
<p>NGA移除访问外链询问
<img alt="NGA移除外链询问" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/NGA移除外链询问.gif"></p>
<p>Twitter、Facebook、Youtube（来自其他同类脚本的评论或issue，本人比较少用，不能保证适用所有场景，有问题可反馈）</p>
</li>
</ol>
<ul>
<li style="font-size: 1em"><strong>相关配置项</strong></li>
</ul>
<ol>
<li>
<p>一键关闭移除链接重定向功能</p>
<p>通过勾选例外域名输入框前的选框可以关闭移除链接重定向功能，即所有域名都是例外域名，同时例外域名输入框也会被禁用。关闭后知乎、简书、贴吧等存在重定向链接的站点的网盘链接无法添加并自动填写密码，也无法转到镜像地址，但可和其他<strong>能预先移除</strong>页面重定向链接的脚本或插件配合使用</p>
</li>
<p><img alt="一键关闭移除链接重定向功能" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/一键关闭移除链接重定向功能.jpg"></p>
<li><p>添加或删除例外域名</p>
<img alt="添加或删除例外域名" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/添加或删除例外域名.gif"></li>
</ol>
</details>

<details style="font-size: 1.5em">
    <summary id="iii">III. 重定向页面自动跳转</summary>
<p>支持的重定向页面站点列表：<a href="http://show.bookmarkearth.com/view/81484">书签地球</a>、<a href="http://t.cn/RgAKoPE">新浪短链</a>、<a href="http://t.cn/A6qYCh4U">新浪绿色上网</a>、<a href="https://sunbox.cc/wp-content/themes/begin/go.php?url=aHR0cHM6Ly9naXRodWIuY29tL0N5ZW5vY2gvRmx1dHRlci1Db29sYXBrL3JlbGVhc2Vz">阳光盒子</a>、<a href="https://www.itdaan.com/link/aHR0cDovL3d3dy5maWxlc29uaWMuY29tL2ZpbGUvMTY5NjYwNzc2MQ==">开发者知识库</a>、<a href="https://link.csdn.net/?target=https://github.com/oneNorth7">CSDN</a>、<a href="https://support.qq.com/products/57688/link-jump?jump=https%3A%2F%2Fcmd.im%2F">兔小巢</a>、<a href="https://c.pc.qq.com/middlem.html?pfurl=bing.com">QQ非官方页面</a>、<a href="https://developers.weixin.qq.com/community/middlepage/href?href=https://github.com/oneNorth7/LinkHelper">微信非官方页面</a>、<a href="https://docs.qq.com/scenario/link.html?url=https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B">腾讯文档</a>、<a href="https://www.tianyancha.com/security?target=http://www.baidu.com">天眼查</a>、<a href="https://www.yuque.com/r/goto?url=https%3A%2F%2Fgitee.com">语雀</a>、<a href="http://jump2.bdimg.com/safecheck/index?url=">百度贴吧</a>、<a href="https://iphone.myzaker.com/zaker/link.php?pk=60bed7f88e9f0921d2076b7b&amp;b=aHR0cHM6Ly9jeWJlcm5ld3MuY29tL3BlcnNvbmFsLWRhdGEtbGVhay1jaGVjay8=&amp;bcode=c1a7a62b&amp;target=_new">Zaker</a>、<a href="https://game.bilibili.com/linkfilter/?url=https://www.bing.com/">哔哩哔哩游戏</a>、<a href="https://www.chinaz.com/go.shtml?url=https://www.bing.com/">站长之家</a>、<a href="https://link.logonews.cn/?url=http://www.mod.gov.cn/topnews/2021-07/29/content_4890496.htm">标志情报局</a>、<a href="https://www.douban.com/link2/?url=https://github.com/oneNorth7/LinkHelper">豆瓣</a>、<a href="https://link.zhihu.com/?target=https://github.com/oneNorth7/LinkHelper">知乎</a>、<a href="https://www.jianshu.com/go-wild?ac=2&url=https://github.com/oneNorth7/LinkHelper">简书</a>、<a href="https://link.juejin.cn/?target=https://github.com/oneNorth7/LinkHelper">掘金</a>、<a href="https://www.oschina.net/action/GoToLink?url=https://github.com/oneNorth7/LinkHelper">开源中国</a>、<a href="https://www.youtube.com/redirect?q=https://github.com/oneNorth7/LinkHelper">Youtube</a> 等等（欢迎热心反馈）</p>
<p>通过<code>移除链接重定向</code>功能可<strong>较大程度</strong>地避免在浏览页面过程中碰到<strong>重定向页面</strong>，但不能排除从浏览记录访问或无法移除链接重定向（例如贴吧链接的文本不是HTTP链接文本而是描述文本）的情况</p>
<img alt="贴吧跳转页面" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/贴吧跳转页面.gif">
</details>

<details style="font-size: 1.5em">
    <summary id="iv">IV. 网盘自动填写密码</summary>
<ol>
<li>
<p>可自动搜索密码并添加，跳转后自动填写密码并提交，支持的网盘或在线文档站点列表：<a href="https://pan.baidu.com/">百度云</a>、<a href="https://eyun.baidu.com/">百度企业网盘</a>、<a href="https://pan.baidu.com/doc">百度云文档</a>、<a href="https://cloud.189.cn/">天翼云盘</a>、<a href="https://www.lanzou.com/">蓝奏云</a>、<a href="https://vdisk.weibo.com/">微盘</a>、<a href="https://share.weiyun.com/">微云</a>、<a href="https://pan.xunlei.com/">迅雷云盘</a>、<a href="http://115.com/">115网盘</a>、<a href="https://caiyun.139.com/">和彩云</a>、<a href="https://quqi.com/">曲奇云</a>、<a href="https://yunpan.360.cn/">360安全云盘</a>、<a href="https://pan-yz.chaoxing.com/">超星云盘</a>、<a href="https://www.wenshushu.cn/">文叔叔</a>、<a href="https://www.jianguoyun.com/">坚果云</a>、<a href="https://shandianpan.com/">闪电盘</a>、<a href="https://my.sharepoint.com/">SharePoint</a>、<a href="https://onedrive.live.com/">OneDrive</a>、<a href="https://cowtransfer.com/">奶牛快传</a>、<a href="http://u.163.com/">网易邮箱网盘</a>、<a href="https://www.aliyundrive.com/">阿里云盘</a>、<a href="https://www.123pan.com/">123云盘</a>、<a href="https://mo.own-cloud.cn/">小麦魔方</a>、<a href="https://cloud.qingstore.cn/">萌云|清玖云</a>、<a href="https://pan.mebk.org/">ME Drive云盘</a>、<a href="https://cncncloud.com/">小太阳云存储</a>、<a href="https://pan.bilnn.com/">比邻云盘</a>、<a href="https://ilolita945.softether.net:5212/">信爱云</a>、<a href="https://my-file.cn/">my-file</a>、<a href="https://bx.qingstore.cn/">玖麦云</a>、<a href="https://pan.mba/">MBA网盘</a>、<a href="https://pan.adycloud.com//">安迪云盘</a>、<a href="https://gofile.me/">gofile</a>、<a href="http://ctfile.com/">城通网盘</a>、<a href="https://www.90pan.com/">90网盘</a></p>
<img alt="网盘自动填写密码" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/网盘自动填写密码.gif">
<img alt="阿里云盘自动填写密码" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/阿里云盘自动填写密码.gif">
<p><strong>不支持云查询密码</strong>，会在点击网盘链接时向后就近搜索页面中的密码，以<code>hash</code>或<code>password</code>参数的形式添加到链接中后使用携带密码的链接跳转</p>
<p><strong>不存储密码</strong>，但会在某些网盘链接<strong>不支持添加hash或<code>password</code>参数</strong>时将密码<strong>临时存储</strong>在脚本的数据页中，旧密码会被新密码覆盖</p>
</li>
<li>
<p>其他暂无密码的网盘或在线文档站点列表：<a href="https://drive.dnxshare.cn/">电脑小分享</a>、<a href="https://down.52pojie.cn/">爱盘</a>、<a href="https://www.yunzhongzhuan.com/">云中转</a>、<a href="https://drive.google.com/">GoogleDrive</a>、<a href="https://mega.nz/">MEGA</a>、<a href="https://www.mediafire.com/">MediaFire</a>、<a href="https://yiqixie.qingque.cn/">一起写</a>、<a href="https://www.androiddownload.net/">AndroidDownload</a>、<a href="https://www.dropbox.com/">Dropbox</a>、<a href="https://www.kufile.net/">库云</a>、<a href="https://disk.yandex.com/">YandexDisk</a>、<a href="https://www.kdocs.cn/">金山文档</a>、<a href="https://pan.bitqiu.com/">比特球云盘</a>、<a href="https://www.feimaoyun.com/">飞猫云</a>、<a href="https://www.fangcloud.com/">亿方云</a>、<a href="https://gd.188988.xyz/">GD DISK</a>、<a href="https://www.yun.cn/">UC网盘</a>、<a href="https://www.yuque.com/">语雀</a>、<a href="https://shimo.im/">石墨文档</a>、<a href="https://www.showdoc.com.cn/">ShowDoc</a>、<a href="https://zijieyunpan.com/">字节网盘</a></p>
</li>
</ol>
</details>

<details style="font-size: 1.5em">
	<summary id="v">V. 网盘密码预处理</summary>
<p>支持的资源站点列表：初音社、百度网盘资源、求资源网、ACG漫音社、蓝鲨、智软酷、百度知道、天翼小站、异星软件空间、APP喵、翻应用 等等（<strong>持续更新中，欢迎热心反馈</strong>）</p>
<img alt="百度知道百度云分享预处理" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/百度知道百度云分享预处理.jpg">
<p>如果某个资源网站的网盘密码<strong>固定</strong>出现在网盘链接的<strong>相对位置</strong>，但点击网盘链接后无法自动添加密码或添加错误，可反馈站点给作者添加预处理功能支持</p>
</details>

<details style="font-size: 1.5em">
    <summary id="vi">VI. 链接净化直达输入框</summary>
<p>在链接直达输入框收起时，移入图标会自动展开，鼠标离开<strong>5秒</strong>后会自动收起，<strong>收起时会清空</strong>输入框内容，点击图标也可<strong>展开/收起</strong>输入框；输入文本<strong>无字数限制</strong>，含多个链接只会处理<strong>第一个</strong>，链接间的中文（标点）字符可被过滤掉</p>
<p><img alt="链接净化直达" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/链接净化直达.gif"></p>
<p>该输入框<strong>默认开启</strong>，可通过脚本的菜单项<strong>随时开启或关闭</strong></p>
<p><img alt="显示链接直达输入框" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/显示链接直达输入框.jpg"></p>
</details>

<details style="font-size: 1.5em">
    <summary id="vii">VII. 自动切换镜像</summary>
<ol>
<li>
<p>点击维基百科、谷歌开发者链接会自动转换为镜像链接并跳转（<strong>默认关闭</strong>，需要用到时可通过配置菜单项<code>自动切换镜像</code>开启）</p>
<img alt="自动切换镜像" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E9%95%9C%E5%83%8F.jpg">
</li>
<li>
<p>开启<code>自动切换镜像</code>后，点击Github链接会询问是否跳转到<code>fastgit</code>、<code>cnpmjs</code>或<code>rc1844</code>镜像站（随机出现），该功能<strong>仅为加速访问并浏览项目</strong>，跳转到镜像站后右下角会有<strong>不要登录帐号</strong>的提示，页面上方的主页图标、登录和注册按钮会被移除，<strong>请不要在镜像网站登录账号，若因此造成任何损失本人概不负责</strong></p>
<img alt="自动切换镜像" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/自动切换镜像.gif">
<p>请勿频繁访问镜像站，否则可能会触发<code>滥用检测机制</code>，需要等几分钟才能再度访问；镜像站可能会找不到某些项目，出现这种情况时可<code>刷新页面</code>再次点击链接随机切换为别的镜像站（若询问还是出现上次404的镜像站，可<strong>多次点击</strong>链接进行随机切换），如果三个镜像站都找不到该项目，则可能Github上也不存在该项目</p>
<img alt="触发滥用检测机制" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/触发滥用检测机制.jpg">
<img alt="git镜像站404" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/git镜像站404.jpg">
<img alt="项目不存在" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/项目不存在.jpg">
</li>
<li>
<p>开启<code>自动切换镜像</code>后，<strong>Chromium系浏览器</strong>中点击谷歌应用商店链接会询问<code>是否跳转镜像站</code>或取消；跳转后如果出现<code>404</code>说明该镜像站可能没有对应的扩展，可返回镜像站尝试输入扩展名称进行搜索
<img alt="谷歌扩展转镜像" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/谷歌扩展转镜像.gif"></p>
</li>
</ol>
</details>

<details style="font-size: 1.5em">
    <summary id="viii">VIII. 自动切换中文</summary>
<p>维基百科及镜像、Mozilla文档、MicroSoft文档、谷歌商店自动切换中文（<strong>默认开启</strong>，可通过脚本的菜单项关闭）</p>
<p><img alt="自动切换中文" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/自动切换中文.jpg"></p>
</details>

<details style="font-size: 1.5em">
    <summary id="ix">IX. 新标签打开链接</summary>
<ol>
<li><p><code>新标签打开链接</code>（默认开启，可通过配置菜单关闭），<strong>翻页链接、锚点链接</strong>会保持原有打开方式，磁力链接、电驴链接和迅雷链接会移除新标签打开属性；论坛自带<code>新窗</code>功能的帖子总览页可能无法通过此功能实现新标签打开帖子（如卡饭论坛等）</p></li>
<p><img alt="新标签打开链接.gif" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.gif.jpg"></p>
<li>
<p>可在启用新标签打开链接功能时针对特定站点屏蔽此功能（<code>保持默认打开方式</code>，优先级最高，可添加或删除）</p>
<img alt="保持默认打开方式" src="https://cdn.jsdelivr.net/gh/oneNorth7/picgo/pics/保持默认打开方式.gif">
</li>
<li>
<p>新标签打开<code>相对链接</code>，可在大量使用相对链接而又需要新标签打开的站点<strong>临时启用</strong>该功能；论坛自带<code>新窗</code>功能的帖子总览页可能无法通过此功能实现新标签打开帖子（如吾爱破解等）</p>
<img alt="新标签打开相对链接" src="https://cdn.jsdelivr.net/gh/oneNorth7/picgo/pics/新标签打开相对链接.gif">
</li>
</ol>
</details>

<details style="font-size: 1.5em">
    <summary id="x">X. 图形化配置菜单</summary>
<ul>
<li style="font-size: 1em">Firefox配置菜单</li>
</ul>
<p><img alt="Firefox配置菜单" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/Firefox配置菜单.jpg"></p>
<ul>
<li style="font-size: 1em">Chrome配置菜单</li>
</ul>
<p><img alt="Chrome配置菜单" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/Chrome%E9%85%8D%E7%BD%AE%E8%8F%9C%E5%8D%95.jpg"></p>
<p>配置菜单面板底部的<code>项目主页</code>是脚本的Github主页，<code>反馈</code>是GreasyFork的反馈页面。</p>
<p>不能保证在所有站点打开的配置菜单面板都和图片相同，若在某些站点发现配置菜单面板显示错位变型且<strong>影响到正常使用</strong>的可反馈作者进行修复。</p>
</details>

## 如果觉得实用方便，麻烦收藏本脚本或关注作者！！！

## 其他说明

* 除了网盘密码预处理功能，脚本的其他功能都是需要使用**鼠标点击**文本或链接才会触发，即点即用，节约资源

* 脚本默认不支持对`<iframe>`页面进行注入，如果需要在`<iframe>`页面注入功能，可以将脚本头部声明中的 `@noframes` 一行删除掉后保存，取消`@noframes`后可能需要**手动排除**一些用`<iframe>`实现的在线编辑页面

* 感谢各位小伙伴使用和热心反馈，让**链接助手**的缺陷得以修复、功能更加完善，本人已在更新信息中注明问题修复或功能更新的反馈来源**以表谢意**，若有低调的小伙伴**不想被提及**，可在**站内私信**本人取消

## 更新信息

* V2.0.1 - 新增123云盘、安迪云盘（from **[胡萝卜周](https://greasyfork.org/zh-CN/scripts/422773-链接助手/discussions/102777)**）自动填写密码功能；新增书行天下预处理功能；优化城通网盘域名映射；更换维基百科镜像域名；优化净化链接功能（from **[Annan Joris](https://greasyfork.org/zh-CN/scripts/422773-链接助手/discussions/100747)**）
* V2.0.0 - 新增配置菜单面板（from **[紫龙](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/93325)**&**[胡萝卜周](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/93918)**）；新增自动打开站点功能；新增跳转页面；新增例外域名（from **[921_j](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/96768)**& **[kky5](https://github.com/oneNorth7/LinkHelper/issues/4)**）；优化移除链接重定向的代码逻辑
* V1.9.9 - 新增异星软件空间、APP喵、翻应用预处理功能；新增Base64链接净化功能；优化跳转页面自动跳转功能
* V1.9.8 - 新增OneDrive、奶牛快传、ODDBA云盘自动填写密码功能；新增标志情报局跳转页面自动跳转功能；优化阿里云盘自动填写密码功能，迅雷云盘和闪电盘添加密码方式改为password参数；优化网盘密码搜索功能；优化链接直达输入框功能
* V1.9.7 - 新增贴吧百度网盘相对链接补全功能（from **[nankewei](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/97502)**）；优化城通网盘域名映射规则；优化磁力链接匹配规则；优化文本转链接功能
* V1.9.6 - 优化天翼小站分享帖预处理功能，取消Go破解预处理功能；新增亚马逊新标签打开链接功能（from **[Amu fighting](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/93805)**）；优化文本转链接功能（from **[胡萝卜周](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/94798)**）；新增站点排除名单（from **[胡萝卜周](https://greasyfork.org/zh-CN/scripts/422773-链接助手/discussions/95373)**&**[蓝城](https://greasyfork.org/zh-CN/scripts/422773-链接助手/discussions/96256)**）；新增例外域名（from **[胡萝卜周](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/95193)**）；修复CSDN点击关注等按钮打开空白页的问题（from **[277169949@qq.com](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/95871)**）；优化twitter移除重定向功能（from **[catshit](https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B/discussions/94901)**）
* 更早的更新历史信息请查看[update_history](./update_history.md`)

## 关注赞赏

**关注我，不迷路**~~ 第一时间获取更新推送！！！

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png" width=400 />

**原创不易，您的支持是我坚持创作的动力**~~

1. 可以通过[爱发电-一个北七](https://afdian.net/@oneNorth7)赞助，也可以直接扫一扫微信赞赏码哦～

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/reward_qrcode.png" width=400 />

2. 或者用支付宝扫一扫红包码或打开支付宝首页搜 `702089817` 领红包支持一下，免费让作者赚个支付宝赏金

<img src="https://gitee.com/oneNorth7/pics/raw/master/picgo/红包码.jpg" width=400 />
