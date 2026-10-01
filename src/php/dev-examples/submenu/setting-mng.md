---
title: Z-BlogPHP 设置管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_SettingMng_SubMenu 接口向后台设置管理页面添加子菜单的完整插件案例。
---

# 设置管理页子菜单扩展

通过 `Filter_Plugin_Admin_SettingMng_SubMenu` 接口，可以在后台「网站设置」页面顶部的子菜单区域追加自定义菜单项，适用于高级设置入口、全局插件设置汇总以及环境检查或诊断工具入口等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_SettingMng_SubMenu` | 无 | 设置管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_SettingMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['站点诊断', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 设置页的子菜单点击后通常跳转到插件自己的 `main.php`，不要修改系统设置页的表单提交逻辑。
