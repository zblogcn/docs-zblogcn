---
title: Z-BlogPHP 模块编辑页子菜单扩展
description: 通过 Filter_Plugin_Module_Edit_SubMenu 接口向后台模块编辑页添加自定义子菜单的完整插件案例。
---

# 模块编辑页子菜单扩展

通过 `Filter_Plugin_Module_Edit_SubMenu` 接口，可以在后台模块编辑页顶部追加自定义菜单项，适用于模块高级设置（自定义缓存时间、额外参数）、预览模块效果以及导入导出模块模板等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Edit_SubMenu` | 无 | 模块编辑页菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Module_Edit_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['预览效果', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 相关接口

- `Filter_Plugin_Module_Edit_Response` — 向模块编辑页注入自定义字段
- `Filter_Plugin_Zbp_BuildModule` — 模块编译时拦截，可对模块内容做自动替换
