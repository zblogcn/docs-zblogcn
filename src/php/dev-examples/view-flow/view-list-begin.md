---
title: Z-BlogPHP 列表查询开始监听扩展
description: 通过 Filter_Plugin_ViewList_Begin 接口在 Z-BlogPHP 的 ViewList() 列表查询开始时执行访问统计、类型判断等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewList_Begin
  - 插件接口
  - 前台流程监听
  - 列表查询
---

# 列表查询开始监听扩展

通过 `Filter_Plugin_ViewList_Begin` 接口，可以在 Z-BlogPHP 的 `ViewList()` 函数列表查询开始时执行自定义逻辑，适用于列表页访问统计、按页面类型做前置处理等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewList_Begin` | 无 | `ViewList()` 列表查询开始时触发 |

## 完整案例

下例统计各类列表页（首页、分类页、标签页等）的访问次数：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewList_Begin', 'demoAPP_ViewList_Begin');
}

function demoAPP_ViewList_Begin()
{
    global $zbp;
    // $zbp->type 为当前列表类型（index、category、tag、author、date）
    $log = date('Y-m-d H:i:s') . ' list ' . $zbp->type . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/list.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数适合做统计、前置判断等轻量级操作；
- 该接口只在走 `index.php` 前台入口的列表页触发，不作用于 `feed.php`、`search.php` 等独立入口；
- 触发时查询条件尚未组装，如需修改查询条件应使用 `Filter_Plugin_ViewList_Core` 接口；
- 列表页包含首页、分类页、标签页、作者页、日期归档页等类型，可通过 `$zbp->type` 区分。
