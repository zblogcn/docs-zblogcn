---
title: Z-BlogPHP 文章/页面编辑页子菜单扩展
description: 通过 Filter_Plugin_Edit_SubMenu 接口向后台文章和独立页面的编辑页添加自定义子菜单的完整插件案例。
---

# 文章/页面编辑页子菜单扩展

通过 `Filter_Plugin_Edit_SubMenu` 接口，可以在后台文章与独立页面的编辑页顶部追加自定义菜单项（该接口在两种编辑页都会触发），适用于添加预览或定时发布等自定义编辑按钮、快速应用文章模板，以及字数统计、摘要自动生成等增强功能入口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_SubMenu` | 无 | 文章/页面编辑页菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['定时发布', $zbp->host . 'zb_users/plugin/demoAPP/main.php',               'm-left', ''];
    $array[] = ['生成摘要', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=summary',   'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 区分文章与页面

回调执行时，可以通过 `GetVars('act', 'GET')` 判断当前编辑的是文章还是独立页面：

```php
function demoAPP_SubMenu()
{
    global $zbp;
    $act = GetVars('act', 'GET');
    if ($act === 'PostEdt') {
        // 文章编辑页独有的子菜单
        echo MakeSubMenu('文章专属工具', '...');
    }
}
```

## 注意事项

- 编辑页子菜单可以与 `Filter_Plugin_Edit_Begin` / `Filter_Plugin_Edit_End` 配合，在编辑表单上方或下方注入自定义字段；
- 编辑页有多处响应输出接口（`Filter_Plugin_Edit_Response` 到 `Response5`），可以在子菜单点击后向编辑页回显处理结果。
