---
title: Z-BlogPHP 页面管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_PageMng_SubMenu 接口向后台页面管理页面添加子菜单的完整插件案例。
---

# 页面管理页子菜单扩展

通过 `Filter_Plugin_Admin_PageMng_SubMenu` 接口，可以在后台「页面管理」页面顶部的子菜单区域追加自定义菜单项，适用于批量创建独立页面、快速应用页面模板以及页面排序工具等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_PageMng_SubMenu` | 无 | 页面管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_PageMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['批量创建页面', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=batch',     'm-left', ''];
    $array[] = ['页面模板管理', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=templates', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- Z-BlogPHP 内置了「新增页面」子菜单，插件可以补充批量操作或模板管理等进阶功能；
- 页面（Page）与文章（Article）是不同的数据类型，后台使用不同的管理接口，开发时注意区分。
