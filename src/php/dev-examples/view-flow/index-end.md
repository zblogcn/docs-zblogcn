---
title: Z-BlogPHP 前台首页入口结束监听扩展
description: 通过 Filter_Plugin_Index_End 接口在 Z-BlogPHP 前台 index.php 路由渲染完成后执行访问日志记录、耗时统计等收尾逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Index_End
  - 插件接口
  - 前台流程监听
---

# 前台首页入口结束监听扩展

通过 `Filter_Plugin_Index_End` 接口，可以在 Z-BlogPHP 前台根目录 `index.php` 路由渲染完成后执行自定义收尾逻辑，适用于访问日志记录、页面耗时统计等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Index_End` | 无 | 前台 `index.php` 路由渲染完成后触发 |

## 完整案例

下例在每次前台访问结束后，向日志文件追加一条访问记录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Index_End', 'demoAPP_Index_End');
}

function demoAPP_Index_End()
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' ' . GetGuestIP() . ' ' . $_SERVER['REQUEST_URI'] . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/visit.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数中应避免再输出页面内容，适合做日志、统计等收尾工作；
- 该接口只在前台根目录 `index.php` 入口触发，不作用于 `feed.php`、`search.php` 等其他入口；
- 触发时页面主体渲染已完成，不宜在此执行跳转或大面积修改输出；
- 写日志等 I/O 操作注意控制频率与文件大小，避免在高访问量站点上影响性能。
