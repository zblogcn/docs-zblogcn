---
title: Z-BlogPHP 插件管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_PluginMng_SubMenu 接口向后台插件管理页面添加子菜单的完整插件案例。
---

# 插件管理页子菜单扩展

通过 `Filter_Plugin_Admin_PluginMng_SubMenu` 接口，可以在后台「插件管理」页面顶部的子菜单区域追加自定义菜单项，适用于插件批量启停、插件市场快速入口，以及一键跳转到某个插件设置页等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_PluginMng_SubMenu` | 无 | 插件管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_PluginMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['链接管理设置', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 插件管理页的子菜单适合放其他插件的快速设置入口，避免用户找不到某个插件的配置页；
