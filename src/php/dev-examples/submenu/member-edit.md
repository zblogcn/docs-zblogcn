---
title: Z-BlogPHP 用户编辑页子菜单扩展
description: 通过 Filter_Plugin_Member_Edit_SubMenu 接口向后台用户编辑页添加自定义子菜单的完整插件案例。
---

# 用户编辑页子菜单扩展

通过 `Filter_Plugin_Member_Edit_SubMenu` 接口，可以在后台用户编辑页顶部追加自定义菜单项，适用于用户扩展字段管理（如自定义资料、会员等级）、查看用户操作日志以及重置用户密码入口等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Edit_SubMenu` | 无 | 用户编辑页菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Edit_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['扩展资料', $zbp->host . 'zb_users/plugin/demoAPP/main.php',          'm-left', ''];
    $array[] = ['操作日志', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=log',  'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 相关接口

- `Filter_Plugin_Member_Edit_Response` — 向用户编辑页注入自定义字段
- `Filter_Plugin_PostMember_Core` / `Succeed` — 用户资料写入前后的数据处理
