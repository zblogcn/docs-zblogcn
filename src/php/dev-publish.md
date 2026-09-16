# 发布应用

Z-Blog 官方搭建的 [`Z-Blog 应用中心`](https://app.zblogcn.com/) 为广大 Z-Blog 使用者和开发者提供了主题和插件的大本营，提供免费与收费的 Z-Blog 主题、模板和插件的下载。

任何希望为 Z-Blog 做贡献的开发者都可以免费加入应用中心，发布自己的应用供所有用户使用。为了保持应用中心应用质量，我们制定了一些应用上架的基本要求，在您的应用符合相应标准后即可发布到应用中心。

## 成为开发者

请在「[Z-Blog 开发者社区](https://bbs.zblogcn.com/)」发帖申请，完成入驻操作。

审核通过后给予开发者权限，之后可上传应用到「[应用中心](https://app.zblogcn.com/)」。

**注：后续应用实行上传后审核发布。**

<details>
<summary>开发者申请流程（点击展开）</summary>

> **Z-Blog 全新的应用中心，为众多开发者提供一个展示自己作品的平台。**

### 前置要求

依据《中华人民共和国网络安全法》的要求，同时为了能尽快通知到您，您必须：

1. 绑定手机号，以完成实名认证要求：<https://user.zblogcn.com/user/security/phone>
2. 绑定微信号，以及时获取审核消息：<https://user.zblogcn.com/user/open/wechat_mp>
3. 提交您的身份证号，完成实名认证：<https://user.zblogcn.com/user/identity>
4. 「可选」开启"两步验证"，<https://user.zblogcn.com/user/security/tfa/google>

如果您需要销售收费应用，则需要：

1. 绑定您的支付宝，以获取收款：<https://user.zblogcn.com/user/open/alipay>

### 申请流程

按照以下步骤进行申请：

1. 为节省时间，请先参照「[注意事项速查表](https://docs.zblogcn.com/php/dev-faq#注意事项速查表 "注意事项速查表")」进行自查；
2. 「可选」基本的 `README.md` 说明，如需附图可放在 `docs/` 目录内或者使用外链；<sup>①</sup>
3. 在 Z-Blog 开发者社区发布一篇介绍文章，并附上代码仓库地址（推荐使用国内平台，如 [CNB](https://cnb.cool/)）；
4. 根据审核员的反馈意见逐条修改，并在社区帖子中更新；每次更新后附上修改记录（Changelog），方便审核员跟踪进度。「**会写更新记录很重要**」
5. 加 QQ 群，积极询问进度；**「QQ 群：983356584」**

①：还是建议外链，`docs/` 感觉打包进 .zba 不是很必要，虽然可以用 `zbignore.txt` 排除；

### 审核流程

1. 在 Z-Blog 开发者社区提交应用后，会有审核员进行审核，并及时反馈审核意见，如有疑问可在 QQ 群沟通。

</details>

## 发布标准

> **推荐阅读：[注意事项速查表](https://docs.zblogcn.com/php/dev-faq#注意事项速查表 "常见问题")**

<details>
<summary>发布标准详情（点击展开）</summary>

### A.通用

1. 开启 debug 模式后不得报错
2. 不得含有木马等有害代码
3. 不得含有任何被加密的 PHP（含 Z5 加密），只能由应用中心服务器端加密
4. PHP 文件应保存为 UTF-8 no BOM 编码；
5. 不得有安全漏洞（包括 SQL 注入、跨站脚本攻击、跨站请求伪造等）
6. 不得引用外站资源（尤其是小站资源）
7. 自动审核内容里不得有黄色提示（使用较老旧版本的 js 等）
8. 不得以免费为饵跳过"应用中心支付系统"搞"内置收费"（微博、微信、支付宝等支付/社交系统或其它功能 API 必须收费的除外）
9. 不得有免费或低价诱导后续高消费、明显高于市场定价等不良意图，或违反公序良俗
10. 不得修改保存系统源码或是系统默认语言包

### B.主题

1. 主题里没有 zblog 版权
2. 自动审核后的截图出现错位等异常情况
3. 标题等长度过长不会导致变形
4. 摘要中的空格被错误移除
5. ul,ol,li,blockquote 等 HTML 元素样式有误
6. 需要提供配置的地方没有可配置的页面
7. 评论层级不对

### C.插件

1. 数据库表和 Class 未使用 zbp 标准数据库创建操作规范
2. 数据库操作未使用链式对象等系统自带操作，而自行拼接 SQL 代码
3. 在应该用 $zbp→CheckRights 判断权限的地方，用简单的 $zbp→User→Level 去判断

### D.上传后的应用发布内容

1. 缺少前台展示截图（如有前台展示的话）
2. 缺少后台截图（如有后台配置的话）
3. 缺少基本的（或详细）使用说明和功能介绍

### E.禁止条款

1. 禁止抄袭复制有版权保护的主题模板
2. 禁止多次提交无意义的应用去刷新排行

</details>

## 应用加密说明

[`Z5加密`](https://z5encrypt.com/) 是由 Z-Blog 应用中心推出的 PHP 加密方案，也是 「Z-Blog 应用中心」 唯一支持的加密方案。为确保用户权益，仅 Z5 加密后的文件可上架到应用中心，非 Z5 加密的应用代码必须以明文形式提交上架。

`Z5加密` 相关介绍内容详见：<https://z5encrypt.com/docs/>

使用说明见：<https://z5encrypt.com/docs/usage/>

## 应用验证

为保证开发者利益，应用中心提供应用购买验证系统用于验证用户使用应用的合法性。应用验证系统与应用中心独立，即使应用中心网站无法访问，也不影响应用验证系统的正常运行。

**开发者应用验证调用**

**新版本 V2 验证**

仅提供 PHP 版本代码，请在应用中心网站后台 → 开发者工具 → 验证代码处获得。

**添加指南**

1. 添加在 `InstallPlugin` 函数中，实现启用插件时自动验证。
2. 需要运行某些速度慢的功能时，如批量发邮件等，可在这之前进行验证。

建议配合 Z5 加密使用。

**不正确行为**

1. 验证因需要连接服务器，会严重影响页面访问速度。因此，不允许在模板的浏览页等地方插入这部分代码。
2. 即使验证不通过，也不允许对用户的数据进行任何意义上的破坏。

## 应用验证回调

### 验证服务端

验证系统会对验证结果加密后，通知到开发者设置的回调地址。HTTP 方法为 `POST`，`Content-Type` 为 `application/zblogverify`。

Body 的加密方式为：**RSA(base64(AES\_KEY) + '.' + base64(AES\_IV) + '.' + HS256(realData) + '.' + timestamp) + '.' + AES(realData)**

RSA 公钥和 HMAC-SHA256 密钥见示例代码。

### 明文数据格式

```json
{
	"id": "65fbe736-aa01-4d60-946a-64da5e1bccd7", /* 本次校验的唯一ID，每一次校验返回值都不同 */
	"from": "initiative", /* 校验来源 */
	"error": {
		"number": 0, /* 错误编号 */
		"message": "OK", /* 错误信息 */
		"verified": true, /* 是否验证成功 */
		"cracking": false, /* 疑似破解 */
		"user": {
			"message": "面向用户的错误信息"
		}
	},
	"appId": "应用ID",
	"host": "网站",
	"user": {
		"id": "应用中心ID",
		"username": "用户账号"
	},
  "modified": "应用最后修改日期（时间戳）",
	"license": {
		"appId": "授权文件保存的应用ID",
		"userId": "授权文件保存的用户ID",
		"timestamp": "授权文件生成时间戳"
	}
}
```

### 示例代码(PHP)

以下代码仅能运行于 PHP 5.3+。请注意，以下代码不对重放攻击做出保证，在入库前请先确认 ID 是否唯一。

```php
<?php
function getVerifyData($data) {
	$publicKey = openssl_pkey_get_public('-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoH4uiMZYWy1sOXuq4YAA
MtyrAtUcWHOXalSAmtDs1FA2H8fTBbEF+gnvg83Byp/mIvHMIaXc7RPIniwoMgDo
Xo3H0GquBEOH4YoufIqfRFGFwnBw7V1KNv9Iw4XpmBYEboD5HT4PLuoUvSP78iWK
7kMMsYsYOVi7EPn8DbPZbvxnrDXkJmkj3l8YhGWtAjbFU7XgyEKEKBTes9fcxWSW
GCdd1jV9oXcV9EQRkRr50wMvydgIWAAWvcVZ5zzK4sZelZDaGz7yEXG/Q1F1Xp3e
GcC057CQoaEzuTQILUCypiNeQpKdzGXxwyp+Q6DAYITjyFBjQ5WbQiSaZtCPV5D9
lwIDAQAB
-----END PUBLIC KEY-----');
	$rsaDecrypted = '';
	$explodeData = explode('.', $data);
	$rsaEncrypted = $explodeData[0];
	$aesEncrypted = $explodeData[1];
	openssl_public_decrypt(base64_decode($rsaEncrypted), $rsaDecrypted, $publicKey);
	$aesInfo = explode('.', $rsaDecrypted);
	$aesKey = base64_decode($aesInfo[0]);
	$aesIv = base64_decode($aesInfo[1]);
	$hash = $aesInfo[2];
	$data = openssl_decrypt(
    base64_decode($aesEncrypted),
    'aes-256-cbc',
    $aesKey,
    OPENSSL_RAW_DATA,
    $aesIv
  );
	if (hash_hmac('sha256', $data, 'zblogverification') === $hash) {
		return json_decode($data, false);
	} else {
		throw new Exception('Hash error!');
	}
}

$object = getVerifyData(file_get_contents('php://input'));

if ($object->error->verified) {
	echo '验证通过';
}

var_dump($object);
```

### 测试数据

```bash
PpBHLt70jUUpA1TdP38tm68bVWxRKDA69GqR04PA6on3lcGAwz2s8Dj4qMvCuMosI6
7b1JNFVELfMmxt1RfKQsSS2vLtIVdblDbmZCBptNd5IYNx2qFZFQQ5Hju3bhwR9VDW
8fcy63bEOpWVYxAEhQXT3ztaLZn63gJhpDemA06Emxv6VJgxfe9uLTX31FCDfg6yd
```

### 服务端插件

你可以直接使用如上代码自行搭建服务端系统，也可以直接使用插件，在应用中心后台填写回调地址即可。
