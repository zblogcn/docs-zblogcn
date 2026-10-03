---
title: Z-BlogPHP 文章查询开始监听扩展
description: 通过 Filter_Plugin_ViewPost_Begin 接口在 Z-BlogPHP 的 ViewPost() 文章查询开始时执行浏览统计、访问前置判断等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewPost_Begin
  - 插件接口
  - 前台流程监听
  - 文章页
---

# 文章查询开始监听扩展

通过 `Filter_Plugin_ViewPost_Begin` 接口，可以在 Z-BlogPHP 的 `ViewPost()` 函数文章查询开始时执行自定义逻辑，适用于文章浏览统计、访问前置判断等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_Begin` | 无 | `ViewPost()` 文章查询开始时触发 |

## 完整案例

下例在每次文章页查询开始时，记录当前访问的文章 ID 到日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewPost_Begin', 'demoAPP_ViewPost_Begin');
}

function demoAPP_ViewPost_Begin()
{
    global $zbp;
    // 文章 ID 一般在路由解析后可通过 $zbp->GetPostById 相关上下文获得
    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    if ($id > 0) {
        $log = date('Y-m-d H:i:s') . ' post ' . $id . ' ' . GetGuestIP() . PHP_EOL;
        $file = $zbp->usersdir . 'plugin/demoAPP/post-view.log';
        file_put_contents($file, $log, FILE_APPEND);
    }
}
```

## 注意事项

- 接口没有参数，回调函数适合做统计、前置判断等轻量级操作；
- 该接口只在走 `index.php` 前台入口的文章页、页面页触发，不作用于 `feed.php`、`search.php` 等独立入口；
- 触发时文章数据尚未查询，如需修改查询条件应使用 `Filter_Plugin_ViewPost_Core` 接口；
- 伪静态模式下文章 ID 可能不在 `$_GET['id']` 中，需要结合路由解析结果获取。
