---
title: Z-BlogPHP 后台首页子菜单扩展
description: 通过 Filter_Plugin_Admin_SiteInfo_SubMenu 接口向后台首页（仪表盘）添加快捷操作面板子菜单的完整插件案例。
---

# 后台首页子菜单扩展

通过 `Filter_Plugin_Admin_SiteInfo_SubMenu` 接口向后台首页（仪表盘）页面添加快捷操作面板子菜单。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_SiteInfo_SubMenu` | 无 | 后台首页页面子菜单 |

## 完整案例

以下案例在后台首页添加快捷入口：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_SiteInfo_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['新建文章', $zbp->host . 'zb_system/cmd.php?act=ArticleEdt', 'm-left', ''];
    $array[] = ['技术支持', 'https://www.zblogcn.com/','m-right', '_blank'];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- 后台首页是用户最常访问的页面，建议子菜单不要过多，避免拥挤；
- 可结合 `Filter_Plugin_Admin_End` 在首页下方注入统计面板或自定义内容。
