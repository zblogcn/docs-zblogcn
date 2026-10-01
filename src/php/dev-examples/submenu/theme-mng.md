---
title: Z-BlogPHP 主题管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_ThemeMng_SubMenu 接口向后台主题管理页面添加子菜单的完整插件案例。
---

# 主题管理页子菜单扩展

通过 `Filter_Plugin_Admin_ThemeMng_SubMenu` 接口，可以在后台「主题管理」页面顶部的子菜单区域追加自定义菜单项，适用于主题一键备份或还原、主题文件编辑器入口以及主题市场快速跳转等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_ThemeMng_SubMenu` | 无 | 主题管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_ThemeMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    $currentTheme = $zbp->theme; // 当前使用的主题 ID
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['备份当前主题', $zbp->host . 'zb_users/plugin/demoAPP/main.php?theme=' . $currentTheme, 'm-left', ''];
    $array[] = ['还原主题',     $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=restore',             'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 主题文件存放在 `zb_users/theme/主题ID/` 目录，备份时要同时打包 template.json、style 目录、script 目录和 include 目录；
- 切换主题时 Z-BlogPHP 会自动重建模板编译文件，插件备份还原逻辑中记得调用 `$zbp->BuildTemplate()`。
