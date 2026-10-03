---
title: Z-BlogPHP RSS 入口开始监听扩展
description: 通过 Filter_Plugin_Feed_Begin 接口在 Z-BlogPHP 前台 feed.php 启动后执行订阅访问统计、订阅开关控制等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Feed_Begin
  - 插件接口
  - 前台流程监听
  - RSS 订阅
---

# RSS 入口开始监听扩展

通过 `Filter_Plugin_Feed_Begin` 接口，可以在 Z-BlogPHP 前台根目录 `feed.php` 启动后执行自定义逻辑，适用于订阅访问统计、关闭或限制 RSS 订阅等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Feed_Begin` | 无 | 前台 `feed.php` 启动后触发，在 RSS 内容生成之前 |

## 完整案例

下例提供关闭 RSS 订阅的能力：开关打开时直接返回 404：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Feed_Begin', 'demoAPP_Feed_Begin');
}

function demoAPP_Feed_Begin()
{
    global $zbp;
    // 订阅开关，可改为读取插件配置
    $feedDisabled = true;
    if ($feedDisabled) {
        $zbp->ShowError(2);
        die();
    }
}
```

## 注意事项

- 接口没有参数，回调函数可通过输出内容并 `die()` 的方式拦截后续输出；
- 该接口只在前台根目录 `feed.php` 入口触发，不作用于 `index.php`、`search.php` 等其他入口；
- 触发时 RSS 内容尚未生成与输出，适合执行拦截、跳转等会终止后续流程的操作；
- 如需修改 RSS 查询条件或输出对象，应使用 `Filter_Plugin_ViewFeed_Core`、`Filter_Plugin_ViewFeed_End` 接口。
