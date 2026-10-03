---
title: Z-BlogPHP RSS 入口结束监听扩展
description: 通过 Filter_Plugin_Feed_End 接口在 Z-BlogPHP 前台 feed.php 输出完成后执行订阅访问统计、日志记录等收尾逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Feed_End
  - 插件接口
  - 前台流程监听
  - RSS 订阅
---

# RSS 入口结束监听扩展

通过 `Filter_Plugin_Feed_End` 接口，可以在 Z-BlogPHP 前台根目录 `feed.php` 输出完成后执行自定义收尾逻辑，适用于订阅访问统计、日志记录等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Feed_End` | 无 | 前台 `feed.php` 输出完成后触发 |

## 完整案例

下例在每次 RSS 订阅输出结束后，记录订阅者 IP 与时间到日志文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Feed_End', 'demoAPP_Feed_End');
}

function demoAPP_Feed_End()
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' ' . GetGuestIP() . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/feed.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数中应避免再输出页面内容，适合做日志、统计等收尾工作；
- 该接口只在前台根目录 `feed.php` 入口触发，不作用于 `index.php`、`search.php` 等其他入口；
- 触发时 RSS 已完整输出，不宜在此执行跳转或修改输出内容；
- 写日志等 I/O 操作注意控制频率与文件大小，避免在高访问量站点上影响性能。
