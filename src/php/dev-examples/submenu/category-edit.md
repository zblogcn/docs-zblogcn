---
title: Z-BlogPHP 分类编辑页子菜单扩展
description: 通过 Filter_Plugin_Category_Edit_SubMenu 接口向后台分类编辑页添加自定义子菜单的完整插件案例。
---

# 分类编辑页子菜单扩展

通过 `Filter_Plugin_Category_Edit_SubMenu` 接口，可以在后台分类编辑页顶部追加自定义菜单项，适用于分类扩展属性（自定义模板、SEO 独立标题）、查看分类下所有文章或页面以及移动分类位置等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Category_Edit_SubMenu` | 无 | 分类编辑页菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Category_Edit_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['自定义模板', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 相关接口

- `Filter_Plugin_Category_Edit_Response` — 向分类编辑页注入自定义字段
- `Filter_Plugin_PostCategory_Core` / `Succeed` — 分类写入前后的数据处理
