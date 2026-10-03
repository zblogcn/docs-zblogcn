---
title: Z-BlogPHP 路由解析结束监听扩展
description: 通过 Filter_Plugin_ViewAuto_End 接口在 Z-BlogPHP 的 ViewAuto() 路由解析结束后执行页面类型统计、自定义收尾逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewAuto_End
  - 插件接口
  - 前台流程监听
  - 路由解析
---

# 路由解析结束监听扩展

通过 `Filter_Plugin_ViewAuto_End` 接口，可以在 Z-BlogPHP 的 `ViewAuto()` 函数路由解析结束后执行自定义逻辑，适用于按解析结果做统计、补充处理等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewAuto_End` | `string $url` | `ViewAuto()` 路由解析结束时触发，`$url` 为解析处理的 URL |

## 完整案例

下例在路由解析结束后，根据解析出的页面类型累加一个内存计数，便于在页面底部输出调试信息：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewAuto_End', 'demoAPP_ViewAuto_End');
}

function demoAPP_ViewAuto_End($url)
{
    global $zbp;
    // $zbp->type 为路由解析得到的页面类型（index、category、article 等）
    $type = $zbp->type;
    $file = $zbp->usersdir . 'plugin/demoAPP/type-count.log';
    file_put_contents($file, date('Y-m-d H:i:s') . ' ' . $type . PHP_EOL, FILE_APPEND);
}
```

## 注意事项

- 参数 `$url` 为系统内部解析用的 URL；
- 该接口由 `ViewAuto()` 触发，只在走 `index.php` 前台入口时生效，不作用于 `feed.php`、`search.php` 等独立入口；
- 触发于路由规则匹配之后、具体页面查询渲染之前，此时 `$zbp->type` 等解析结果已可用；
- 如需在解析前预处理请求，应使用 `Filter_Plugin_ViewAuto_Begin` 接口。
