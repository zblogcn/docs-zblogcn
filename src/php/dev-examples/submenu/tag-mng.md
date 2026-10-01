---
title: Z-BlogPHP 标签管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_TagMng_SubMenu 接口向后台标签管理页面添加子菜单的完整插件案例。
---

# 标签管理页子菜单扩展

通过 `Filter_Plugin_Admin_TagMng_SubMenu` 接口，可以在后台「标签管理」页面顶部的子菜单区域追加自定义菜单项，适用于标签合并、批量删除空标签以及标签导入导出等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_TagMng_SubMenu` | 无 | 标签管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_TagMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['标签合并',   $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=merge', 'm-left', ''];
    $array[] = ['清理空标签', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=clean', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- Z-BlogPHP 内置了「新增标签」子菜单，插件的批量功能作为进阶补充；
