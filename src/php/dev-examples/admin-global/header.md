---
title: Z-BlogPHP 后台 Header 输出扩展
description: 通过 Filter_Plugin_Admin_Header 接口在 Z-BlogPHP 后台所有页面的 head 区域追加 CSS、JavaScript 等资源的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Header
  - 插件接口
  - 后台
  - header
---

# 后台 Header 输出扩展

通过 `Filter_Plugin_Admin_Header` 接口，可以在 Z-BlogPHP 后台页面的 `<head>` 区域末尾追加内容，适用于加载插件后台专用的样式表、脚本或自定义 `meta` 标签等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Header` | 无 | 在后台页面 `<head>` 末尾输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_Header', 'demoAPP_Admin_Header');
}

function demoAPP_Admin_Header()
{
    global $zbp;
    // 接口在系统自带样式、脚本之后执行，直接 echo 即可
    echo '<link rel="stylesheet" type="text/css" href="' . $zbp->host . 'zb_users/plugin/demoAPP/css/admin.css" />';
    echo '<script src="' . $zbp->host . 'zb_users/plugin/demoAPP/script/admin.js"></script>';
}
```

## 注意事项

- 接口没有参数，回调函数通过 **`echo`** 输出内容；输出位置在 `zb_system/admin/admin_header.php` 的 `<head>` 内、系统自带 CSS 和 JavaScript 之后；
- 后台每个页面都会加载 `admin_header.php`，因此该接口对所有后台页面生效；只需在部分页面加载资源时，可在回调中用 `GetVars('act', 'GET')` 判断当前页面；
- 输出内容位于 `<head>` 内，只适合放样式、脚本、`meta` 等头部资源，不要输出可见的页面元素，可见内容应使用 `Filter_Plugin_Admin_Footer` 或具体页面的 SubMenu 接口；
- 系统自身也通过该接口加载图标字体、移动端适配样式等内容，插件写法与之一致。
