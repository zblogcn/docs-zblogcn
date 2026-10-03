---
title: Z-BlogPHP 后台侧栏菜单扩展
description: 通过 Filter_Plugin_Admin_LeftMenu 接口向 Z-BlogPHP 后台左侧导航栏添加自定义菜单项的完整插件案例，包含 MakeLeftMenu 的参数说明。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_LeftMenu
  - MakeLeftMenu
  - 插件接口
  - 侧栏菜单
---

# 后台侧栏菜单扩展

通过 `Filter_Plugin_Admin_LeftMenu` 接口，可以向 Z-BlogPHP 后台左侧导航栏添加自定义菜单项，例如把插件的管理页面放入侧栏，与「文章管理」「插件管理」等系统入口并列。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_LeftMenu` | `arr &$leftmenus` | 左侧导航菜单项数组，引用传入 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_LeftMenu', 'demoAPP_Admin_LeftMenu');
}

function demoAPP_Admin_LeftMenu(&$leftmenus)
{
    global $zbp;
    // 参数依次为：权限动作、菜单名称、链接、li 标签 id、a 标签 id、图片 URL、图标类名
    $leftmenus['nav_demoapp'] = MakeLeftMenu(
        'root',
        'demoAPP 管理',
        $zbp->host . 'zb_users/plugin/demoAPP/main.php',
        'nav_demoapp',
        'aDemoAPP',
        '',
        'icon-gear-fill'
    );
}
```

## MakeLeftMenu 参数

```php
MakeLeftMenu($requireAction, $strName, $strUrl, $strLiId, $strAId, $strImgUrl, $strIconClass = '')
```

| 参数 | 说明 |
| --- | --- |
| `$requireAction` | 要求的权限动作，函数内部通过 `$zbp->CheckRights()` 校验，无权限时返回空字符串，菜单项不显示 |
| `$strName` | 菜单显示名称 |
| `$strUrl` | 菜单链接 |
| `$strLiId` | `<li>` 标签的 id |
| `$strAId` | `<a>` 标签的 id |
| `$strImgUrl` | 菜单图片 URL，与图标类名二选一，留空即可 |
| `$strIconClass` | 可选，系统图标字体的类名（来自 `icon.css`）；不传图片和图标时使用默认图标 |

## 注意事项

- `$leftmenus` 以引用方式传入，每个元素是 `MakeLeftMenu()` 返回的 `<li>` HTML 字符串，直接向数组追加元素即可，无需返回值；
- 系统内置菜单使用 `nav_xxx` 形式的字符串键名，插件自定义菜单建议遵循同样的命名方式，避免键名冲突；
- 接口在全部系统内置菜单项组装完成之后执行，插件菜单显示在侧栏最后；
- 第一个参数权限动作按实际需要填写（如 `'root'` 表示仅管理员），系统会自动处理无权限用户的显示问题。
