---
title: Z-BlogPHP 文章编辑页头部输出扩展
description: 通过 Filter_Plugin_Edit_Begin 接口在 Z-BlogPHP 后台文章和独立页面编辑页的头部区域追加样式、脚本等内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Edit_Begin
  - 插件接口
  - 文章编辑页
  - 后台输出
---

# 文章编辑页头部输出扩展

通过 `Filter_Plugin_Edit_Begin` 接口，可以在 Z-BlogPHP 后台文章/独立页面编辑页的头部区域追加内容，适用于为编辑页加载插件专用样式、脚本等场景。文章和独立页面共用 `edit.php` 编辑页，该接口对两者同时生效。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_Begin` | 无 | 编辑页头部区域（`<head>` 结束后、顶部菜单渲染前）输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_Begin', 'demoAPP_Edit_Begin');
}

function demoAPP_Edit_Begin()
{
    global $zbp;
    echo '<link rel="stylesheet" type="text/css" href="' . $zbp->host . 'zb_users/plugin/demoAPP/css/edit.css" />';
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容；调用位置在 `zb_system/admin/edit.php` 中，即系统头部和 jQuery 相关脚本加载之后、顶部菜单渲染之前；
- 系统自身也通过该接口注册过处理函数（如 `utf84mb_fixHtmlSpecialChars`），插件写法与之一致；
- 该接口位于编辑页的头部区域，适合加载样式和脚本；如需在表单内部插入输入框等可见内容，应使用 `Filter_Plugin_Edit_Response` 系列接口；
- 只需在文章页或独立页面之一生效时，可在回调中通过 `GetVars('act', 'GET')` 区分（`ArticleEdt` 为文章，`PageEdt` 为独立页面）。
