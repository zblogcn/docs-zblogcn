---
title: Z-BlogPHP 首页渲染入口监听扩展
description: 通过 Filter_Plugin_ViewIndex_Begin 接口在 Z-BlogPHP 的 ViewIndex() 首页渲染入口执行自定义逻辑、按 URL 做跳转或统计的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewIndex_Begin
  - 插件接口
  - 前台流程监听
  - 首页渲染
---

# 首页渲染入口监听扩展

通过 `Filter_Plugin_ViewIndex_Begin` 接口，可以在 Z-BlogPHP 的 `ViewIndex()` 函数首页渲染入口处执行自定义逻辑，适用于针对首页请求做跳转、统计或权限判断等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewIndex_Begin` | `string $url` | `ViewIndex()` 首页渲染入口触发，`$url` 为当前请求的 URL |

## 完整案例

下例在首页被访问时，把来自特定来源的访客重定向到一个落地页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewIndex_Begin', 'demoAPP_ViewIndex_Begin');
}

function demoAPP_ViewIndex_Begin($url)
{
    global $zbp;
    // 仅处理真正的首页请求
    if ($url == 'index.php' || $url == '') {
        if (isset($_GET['from']) && $_GET['from'] == 'ad') {
            header('Location: ' . $zbp->host . 'landing.html');
            die();
        }
    }
}
```

## 注意事项

- 参数 `$url` 为当前请求的 URL，可用它判断是否为首页请求；
- 该接口由 `ViewIndex()` 触发，只在走 `index.php` 前台入口的页面生效，不作用于 `feed.php`、`search.php` 等独立入口；
- 触发时页面 HTML 尚未输出，适合执行跳转等会终止后续渲染的操作；
- 接口触发于具体列表或文章查询之前，如需修改查询条件应使用 `Filter_Plugin_ViewList_Core`、`Filter_Plugin_ViewPost_Core` 等接口。
