---
title: Z-BlogPHP 分类管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_CategoryMng_SubMenu 接口向后台分类管理页面添加子菜单的完整插件案例。
---

# 分类管理页子菜单扩展

通过 `Filter_Plugin_Admin_CategoryMng_SubMenu` 接口，可以在后台「分类管理」页面顶部的子菜单区域追加自定义菜单项，适用于分类合并、批量编辑（排序、改名）以及将文章在分类间迁移等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_CategoryMng_SubMenu` | 无 | 分类管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_CategoryMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['分类合并', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=merge', 'm-left', ''];
    $array[] = ['批量迁移', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=move',  'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 分类有层级关系（父子分类），合并操作时要递归处理子分类。
