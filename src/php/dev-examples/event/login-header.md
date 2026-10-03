---
title: Z-BlogPHP 登录页 Header 扩展
description: 通过 Filter_Plugin_Login_Header 接口向 Z-BlogPHP 系统登录页 head 区注入自定义样式与脚本的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Login_Header
  - 插件接口
  - 登录页
  - 定制
---

# 登录页 Header 扩展

通过 `Filter_Plugin_Login_Header` 接口，可以向 Z-BlogPHP 系统登录页 `zb_system/login.php` 的 `<head>` 区注入自定义样式、脚本等资源，用于品牌化定制登录界面。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Login_Header` | 无 | 定义 Login.php 首页 header 接口 |

## 完整案例

下例为登录页替换背景配色并追加自定义脚本：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Login_Header', 'demoAPP_Login_Header');
}

function demoAPP_Login_Header()
{
    global $zbp;

    echo '<style type="text/css">' . PHP_EOL;
    echo '.body-login .bg { background-color: #2b3a52; }' . PHP_EOL;
    echo '.body-login .logo img { display: none; }' . PHP_EOL;
    echo '</style>' . PHP_EOL;
    echo '<script type="text/javascript" src="' . $zbp->host . 'zb_users/plugin/demoAPP/login.js"></script>' . PHP_EOL;
}
```

## 注意事项

- 触发位置在 `zb_system/login.php` 的 `<head>` 结束之前，登录页自身的 CSS 与 JS 均已输出；
- 该页面在文件开头已执行 `$zbp->Load()`，回调中可以安全使用 `$zbp->host`、配置与语言项；
- 系统自身也会在该接口挂载回调（如加载后台附加字体的 `Include_AddonAdminFont`），各回调相互独立、按注册顺序执行；
- 输出的内容会原样进入 HTML，注意对动态值做转义，避免注入风险；
- 如需向后台管理页、杂项页或错误页注入资源，应分别使用 `Filter_Plugin_Admin_Header`、`Filter_Plugin_Other_Header` 等接口。
