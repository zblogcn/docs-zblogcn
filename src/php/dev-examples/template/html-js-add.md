---
title: Z-BlogPHP 前台脚本追加输出案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Html_Js_Add 接口向前台公共脚本 c_html_js_add.php 追加自定义 JS 代码的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Html_Js_Add
  - 前台脚本
  - 插件接口
  - JavaScript
---

# 前台脚本追加输出

`Filter_Plugin_Html_Js_Add` 是 Z-BlogPHP 前台公共脚本 `zb_system/script/c_html_js_add.php` 的追加接口。该脚本以 JS 文件形式被前台主题引用，内置评论提交、用户信息输出等公共前端逻辑，插件通过此接口可在脚本末尾输出自己的 JavaScript 代码，向全站前台注入脚本而无需修改主题。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Html_Js_Add` | 无 | c_html_js_add.php 脚本接口，允许插件在 c_html_js_add.php 内输出内容 |

## 完整案例

下例在前台公共脚本末尾追加一段自定义 JS，定义全局变量并绑定一个简单事件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Html_Js_Add', 'demoAPP_Html_Js_Add');
}

function demoAPP_Html_Js_Add()
{
    // 回调内直接 echo 输出 JS 语句
    echo 'var demoAPP_enabled = true;' . PHP_EOL;
    echo 'console.log("demoAPP 前台脚本已加载，站点版本：" + zbpConfig.blogversion);' . PHP_EOL;
    echo 'if (window.jQuery) {' . PHP_EOL;
    echo '  $(function () { $("body").addClass("demoAPP-on"); });' . PHP_EOL;
    echo '}' . PHP_EOL;
}
```

主题在前台以 `<script src="{$host}zb_system/script/c_html_js_add.php" ></script>` 方式引用该脚本，页面加载后即可看到追加的代码生效。

## 注意事项

- 该接口属于输出期接口，浏览器每次请求该脚本都会执行（脚本带 Etag 缓存，内容不变时命中 304 则不会重新执行 PHP 部分）；
- 回调没有参数也没有返回值语义，输出完全依靠 `echo`，输出的内容必须是合法 JavaScript，注意转义引号与换行；
- 追加位置在系统公共 JS 之后、脚本输出结束之前，可以使用脚本内已定义的 `zbpConfig`、`zbp`、`bloghost` 等变量；
- 整个脚本输出会被 ob 缓存并按内容 md5 生成 Etag，输出内容变化会自动更新缓存标识；
- 输出体积尽量精简，该脚本面向全站前台加载，过大的内容会拖慢所有页面。
