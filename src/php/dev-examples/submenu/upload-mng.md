---
title: Z-BlogPHP 附件管理页子菜单扩展
description: 通过 Filter_Plugin_Admin_UploadMng_SubMenu 接口向后台附件管理页面添加子菜单的完整插件案例。
---

# 附件管理页子菜单扩展

通过 `Filter_Plugin_Admin_UploadMng_SubMenu` 接口，可以在后台「附件管理」页面顶部的子菜单区域追加自定义菜单项，适用于清理孤儿文件或过期缩略图、附件压缩与格式转换，以及 CDN 同步等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_UploadMng_SubMenu` | 无 | 附件管理页面子菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_UploadMng_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['清理孤儿附件', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=orphan',   'm-left', ''];
    $array[] = ['压缩图片',     $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=compress', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 注意事项

- Z-BlogPHP 1.7 版本起内置了缩略图基类，1.7.4 支持 webp 和 avif 格式转换，可在此基础上扩展自动压缩工具；
- 附件文件存放在 `zb_users/upload/` 目录，注意操作前做备份。
