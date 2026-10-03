---
title: Z-BlogPHP 前台 zbpConfig 扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Html_Js_ZbpConfig 接口扩展前台 zbpConfig 配置对象，自定义评论组件配置的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Html_Js_ZbpConfig
  - zbpConfig
  - 插件接口
  - 前端配置
---

# 前台 zbpConfig 扩展

`Filter_Plugin_Html_Js_ZbpConfig` 是 Z-BlogPHP 前台公共脚本 `zb_system/script/c_html_js_add.php` 的配置扩展接口，输出位置在 `zbpConfig` 对象字面量定义之后、`var zbp = new ZBP(zbpConfig);` 初始化之前。插件通过此接口输出 JS 语句，可以在 `zbp` 实例创建前修改或补充配置项，例如调整评论组件的输入选择器与校验规则。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Html_Js_ZbpConfig` | 无 | c_html_js_add.php 脚本接口，允许插件设置 zbpConfig |

## 完整案例

下例为 `zbpConfig` 追加插件专属配置，并把评论内容输入框的校验规则改为最少 5 个字符：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Html_Js_ZbpConfig', 'demoAPP_Html_Js_ZbpConfig');
}

function demoAPP_Html_Js_ZbpConfig()
{
    // 此时 zbpConfig 对象已定义，用 JS 语句修改或扩展它
    echo 'zbpConfig.demoAPP = { enabled: true, api: "' . $GLOBALS['zbp']->host . 'feed.php" };' . PHP_EOL;
    echo 'zbpConfig.comment.inputs.content = {' . PHP_EOL;
    echo '  selector: "#txaArticle",' . PHP_EOL;
    echo '  required: true,' . PHP_EOL;
    echo '  validateRule: /^[\\s\\S]{5,}$/ig,' . PHP_EOL;
    echo '  validateFailedErrorCode: 46' . PHP_EOL;
    echo '};' . PHP_EOL;
}
```

前台脚本加载后，`zbp = new ZBP(zbpConfig)` 即携带插件补充的配置初始化，评论组件按新规则工作。

## 注意事项

- 该接口属于输出期接口，浏览器每次请求 `c_html_js_add.php` 都会执行（受 Etag 缓存影响，内容不变时返回 304）；
- 输出位置决定只能用 JS 语句操作已定义的 `zbpConfig` 对象，不能在此输出 `<script>` 标签或 PHP 之外的 HTML；
- 回调没有参数与返回值语义，完全依靠 `echo` 输出合法 JavaScript；
- 修改系统已有配置键（如 `comment.inputs.*`）会影响评论组件默认行为，插件自有配置请加插件名前缀；
- `zbpConfig` 中输出站点数据时可读取 `$zbp` 全局对象，但注意不要泄露仅后台可见的配置。
