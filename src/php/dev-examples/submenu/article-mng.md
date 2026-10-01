---
title: Z-BlogPHP 文章管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_ArticleMng_SubMenu 接口向后台文章管理页面添加子菜单的完整插件案例。
---

# 文章管理页子菜单扩展

通过 `Filter_Plugin_Admin_ArticleMng_SubMenu` 接口，可以在后台「文章管理」页面顶部的子菜单区域追加自定义菜单项，适用于批量生成或导入文章、文章分类批量处理，以及添加自定义管理工具入口等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_ArticleMng_SubMenu` | 无 | 文章管理页面子菜单 |

## 完整案例

以下案例在文章管理页面添加「批量生成文章」入口，点击跳转到插件自己的后台页面：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_ArticleMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['批量生成文章', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 文章管理页本身已有「新增文章」子菜单，插件追加的菜单可以用不同的图标和颜色区分；
- 可用 `GetVars()` 读取列表页当前的筛选条件，按场景决定是否显示某个菜单，例如 `GetVars('status')` 判断文章状态（公开/草稿/待审核）、`GetVars('category')` 判断当前分类、`GetVars('istop')` 判断是否仅看置顶文章。
