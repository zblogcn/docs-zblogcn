---
title: Z-BlogPHP 用户管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_MemberMng_SubMenu 接口向后台用户管理页面添加子菜单的完整插件案例。
---

# 用户管理页子菜单扩展

通过 `Filter_Plugin_Admin_MemberMng_SubMenu` 接口，可以在后台「用户管理」页面顶部的子菜单区域追加自定义菜单项，适用于批量导出用户数据（CSV/JSON）、批量设置用户权限以及用户积分或等级管理等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_MemberMng_SubMenu` | 无 | 用户管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_MemberMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['导出用户',     $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=export', 'm-left', ''];
    $array[] = ['批量设置等级', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=level',  'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 用户等级有系统内置值（管理员、编辑、作者、成员、访客），不要随意新增等级类型；
- 敏感操作（批量删除、权限修改）建议在子菜单入口加确认提示。
