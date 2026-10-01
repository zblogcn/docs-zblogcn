---
title: Z-BlogPHP 标签编辑页子菜单扩展
description: 通过 Filter_Plugin_Tag_Edit_SubMenu 接口向后台标签编辑页添加自定义子菜单的完整插件案例。
---

# 标签编辑页子菜单扩展

通过 `Filter_Plugin_Tag_Edit_SubMenu` 接口，可以在后台标签编辑页顶部追加自定义菜单项，适用于标签扩展属性（SEO 描述、自定义模板）、查看该标签下的文章列表以及标签合并操作等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Edit_SubMenu` | 无 | 标签编辑页菜单 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Edit_SubMenu', 'demoAPP_SubMenu');
}

function demoAPP_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['SEO 设置', $zbp->host . 'zb_users/plugin/demoAPP/main.php', 'm-left', ''];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

## 相关接口

与本接口配合使用的还有：
- `Filter_Plugin_Tag_Edit_Response` — 向标签编辑页注入自定义表单项
- `Filter_Plugin_PostTag_Core` / `Succeed` — 处理标签写入前后的数据
