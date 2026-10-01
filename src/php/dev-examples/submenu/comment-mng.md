---
title: Z-BlogPHP 评论管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_CommentMng_SubMenu 接口向后台评论管理页面添加子菜单的完整插件案例。
---

# 评论管理页子菜单扩展

通过 `Filter_Plugin_Admin_CommentMng_SubMenu` 接口，可以在后台「评论管理」页面顶部的子菜单区域追加自定义菜单项，适用于评论垃圾过滤、批量审核或删除评论以及评论统计面板等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_CommentMng_SubMenu` | 无 | 评论管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_CommentMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['批量审核',     $zbp->host . 'zb_system/cmd.php?act=Batch&type=comment&status=public', 'm-left', ''];
    $array[] = ['评论过滤规则', $zbp->host . 'zb_users/plugin/demoAPP/main.php',                 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 评论状态分为已发布（public）、待审核（audit）、垃圾（spam）、隐藏（hide），可在子菜单链接上加上 `&status=xxx` 直接跳转到对应筛选视图；
- 结合 `Filter_Plugin_Admin_CommentMng_Table` 接口可以同时扩展评论列表表格列。
