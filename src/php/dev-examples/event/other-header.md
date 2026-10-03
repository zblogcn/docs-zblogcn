---
title: Z-BlogPHP 其他页 Header 扩展
description: 通过 Filter_Plugin_Other_Header 接口向 Z-BlogPHP 杂项页与系统错误页的 head 区注入自定义资源的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Other_Header
  - 插件接口
  - 错误页
  - 页面定制
---

# 其他页 Header 扩展

通过 `Filter_Plugin_Other_Header` 接口，可以向 Z-BlogPHP 中除登录页、后台管理页之外的系统页面（杂项权限查看页、phpinfo 页、系统错误页）的 `<head>` 区注入自定义资源。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Other_Header` | 无 | 定义其它页的 header 接口 |

## 完整案例

下例为这些系统页面统一补充站点图标与自定义样式：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Other_Header', 'demoAPP_Other_Header');
}

function demoAPP_Other_Header()
{
    global $zbp;

    echo '<link rel="icon" href="' . $zbp->host . 'favicon.ico" type="image/x-icon" />' . PHP_EOL;
    echo '<style type="text/css">.login .logo img { opacity: 0.8; }</style>' . PHP_EOL;
}
```

## 注意事项

- 触发位置有三处：`zb_system/function/c_system_misc.php` 中杂项权限查看页与 phpinfo 页的 `<head>`，以及系统错误页 `zb_system/defend/error.php` 的 `<head>`；
- 与 `Filter_Plugin_Login_Header` 互补：登录页用 Login_Header，其余系统页头部用本接口；
- 系统错误页触发时系统可能正处于异常状态，回调内应避免复杂逻辑，也不要再抛出异常，以免中断错误页渲染；
- 接口没有参数，输出内容原样进入 HTML `<head>`，注意转义动态值。
