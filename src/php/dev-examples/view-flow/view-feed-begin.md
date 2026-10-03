---
title: Z-BlogPHP RSS 生成开始监听扩展
description: 通过 Filter_Plugin_ViewFeed_Begin 接口在 Z-BlogPHP 的 ViewFeed() 函数 RSS 生成开始时执行订阅访问统计、来源判断等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewFeed_Begin
  - 插件接口
  - 前台流程监听
  - RSS 订阅
---

# RSS 生成开始监听扩展

通过 `Filter_Plugin_ViewFeed_Begin` 接口，可以在 Z-BlogPHP 的 `ViewFeed()` 函数开始生成 RSS 时执行自定义逻辑，适用于订阅访问统计、来源判断等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewFeed_Begin` | 无 | `ViewFeed()` RSS 生成开始时触发 |

## 完整案例

下例在每次生成 RSS 时，统计订阅来源并记录到日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewFeed_Begin', 'demoAPP_ViewFeed_Begin');
}

function demoAPP_ViewFeed_Begin()
{
    global $zbp;
    $referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'direct';
    $log = date('Y-m-d H:i:s') . ' feed ' . GetGuestIP() . ' ' . $referer . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/subscribe.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数适合做日志、统计等轻量级操作；
- 该接口只在 `feed.php` 入口触发，不作用于 `index.php`、`search.php` 等其他入口；
- 触发时 RSS 内容尚未生成，如需修改查询条件应使用 `Filter_Plugin_ViewFeed_Core`，如需修改输出对象应使用 `Filter_Plugin_ViewFeed_End`；
- 不宜在此处输出内容或调用 `die()`，否则会中断 RSS 的后续生成与输出。
