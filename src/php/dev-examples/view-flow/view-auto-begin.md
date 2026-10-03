---
title: Z-BlogPHP 路由解析开始监听扩展
description: 通过 Filter_Plugin_ViewAuto_Begin 接口在 Z-BlogPHP 的 ViewAuto() 路由解析开始时执行 URL 判断、伪静态预处理等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewAuto_Begin
  - 插件接口
  - 前台流程监听
  - 路由解析
---

# 路由解析开始监听扩展

通过 `Filter_Plugin_ViewAuto_Begin` 接口，可以在 Z-BlogPHP 的 `ViewAuto()` 函数路由解析开始时执行自定义逻辑，适用于在 URL 解析前做预处理、拦截或统计等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewAuto_Begin` | `string $inpurl, string $url` | `ViewAuto()` 路由解析开始时触发，`$inpurl` 为原始请求 URL，`$url` 为解析用的 URL |

## 完整案例

下例记录所有进入路由解析的请求地址，用于分析站点访问路径：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewAuto_Begin', 'demoAPP_ViewAuto_Begin');
}

function demoAPP_ViewAuto_Begin($inpurl, $url)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' ' . $inpurl . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/route.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 参数 `$inpurl` 为进入解析前的原始请求 URL，`$url` 为系统内部用于解析的 URL，两者可能因伪静态规则而不同；
- 该接口由 `ViewAuto()` 触发，只在走 `index.php` 前台入口时生效，不作用于 `feed.php`、`search.php` 等独立入口；
- 触发于路由规则匹配之前，适合做全局性的请求预处理；如需在解析完成后处理，可使用 `Filter_Plugin_ViewAuto_End`；
- 日志类操作注意控制写入频率，避免高访问量下影响性能。
