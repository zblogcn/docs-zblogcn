---
title: Z-BlogPHP 模块管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_ModuleMng_SubMenu 接口向后台模块管理页面添加子菜单的完整插件案例。
---

# 模块管理页子菜单扩展

通过 `Filter_Plugin_Admin_ModuleMng_SubMenu` 接口，可以在后台「模块管理」页面顶部的子菜单区域追加自定义菜单项，适用于模块批量编辑（批量替换内容、批量重置）、模块导出导入以及自定义模块生成器等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_ModuleMng_SubMenu` | 无 | 模块管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_ModuleMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['批量替换内容', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=replace', 'm-left', ''];
    $array[] = ['导入模块',     $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=import',  'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 模块有多种来源（系统内置、插件创建、文件模块），批量操作时要区分来源避免误删；
- 修改模块内容后记得调用 `$zbp->BuildModule()` 重建编译缓存。
