---
title: Z-BlogPHP 后台顶部菜单扩展
description: 通过 Filter_Plugin_Admin_TopMenu 接口向 Z-BlogPHP 后台顶部导航栏添加自定义菜单项的完整插件案例，包含 MakeTopMenu 的参数说明。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_TopMenu
  - MakeTopMenu
  - 插件接口
  - 顶部菜单
---

# 后台顶部菜单扩展

通过 `Filter_Plugin_Admin_TopMenu` 接口，可以向 Z-BlogPHP 后台顶部导航栏添加自定义菜单项，例如为插件的管理页面增加一个顶部入口，适用于需要在后台任意页面都能快速进入的功能。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_TopMenu` | `arr &$topmenus` | 顶部导航菜单项数组，引用传入 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_TopMenu', 'demoAPP_Admin_TopMenu');
}

function demoAPP_Admin_TopMenu(&$topmenus)
{
    global $zbp;
    // 参数依次为：权限动作、菜单名称、链接、target、li 标签 id、图标类名
    $topmenus[] = MakeTopMenu(
        'root',
        'demoAPP 管理',
        $zbp->host . 'zb_users/plugin/demoAPP/main.php',
        '',
        'topmenu_demoapp',
        'icon-gear-fill'
    );
}
```

## MakeTopMenu 参数

```php
MakeTopMenu($requireAction, $strName, $strUrl, $strTarget, $strLiId, $strIconClass = '')
```

| 参数 | 说明 |
| --- | --- |
| `$requireAction` | 要求的权限动作，函数内部通过 `$zbp->CheckRights()` 校验，无权限时返回空字符串，菜单项不显示 |
| `$strName` | 菜单显示名称 |
| `$strUrl` | 菜单链接 |
| `$strTarget` | 链接的 target，留空时默认为 `_self`，新窗口打开填 `_blank` |
| `$strLiId` | `<li>` 标签的 id，留空时自动生成 |
| `$strIconClass` | 可选，系统图标字体的类名（来自 `icon.css`），留空则只显示文字 |

## 注意事项

- `$topmenus` 以引用方式传入，每个元素是 `MakeTopMenu()` 返回的 `<li>` HTML 字符串，直接向数组追加元素即可，无需返回值；
- 接口在系统内置的「仪表盘」「网站设置」之后、右侧「官方网站」之前执行，因此插件菜单位于顶部导航的中间区域；
- 第一个参数权限动作按实际需要填写（如 `'root'` 表示仅管理员），系统会自动处理无权限用户的显示问题；
- 只想在某个具体管理页内追加菜单时，应使用对应的 SubMenu 接口，而不是顶部菜单接口。
