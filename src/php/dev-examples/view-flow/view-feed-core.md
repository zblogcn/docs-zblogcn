---
title: Z-BlogPHP RSS 查询条件修改扩展
description: 通过 Filter_Plugin_ViewFeed_Core 接口在 Z-BlogPHP 的 ViewFeed() 组装 RSS 查询条件时修改条件，实现 RSS 只输出指定分类或标签等效果的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewFeed_Core
  - 插件接口
  - 前台流程监听
  - RSS 订阅
  - 查询条件
---

# RSS 查询条件修改扩展

通过 `Filter_Plugin_ViewFeed_Core` 接口，可以在 Z-BlogPHP 的 `ViewFeed()` 函数组装 RSS 查询条件时修改查询条件，适用于让 RSS 只输出指定分类、排除特定标签等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewFeed_Core` | `array &$w` | `ViewFeed()` 组装查询条件时触发，`$w` 为查询条件数组 |

## 完整案例

下例让 RSS 只输出分类 ID 为 2 和 5 的文章：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewFeed_Core', 'demoAPP_ViewFeed_Core');
}

function demoAPP_ViewFeed_Core(&$w)
{
    $w[] = array('IN', 'log_CateID', array(2, 5));
}
```

## 注意事项

- 参数 `$w` 为查询条件数组，需要在回调签名中使用引用传递 `&$w`，才能对查询条件生效；
- 该接口只在 `feed.php` 入口触发，不作用于 `index.php`、`search.php` 等其他入口；
- 修改 `$w` 等条件将直接影响最终 SQL，如需限制只输出某个分类，可使用 `array('IN', 'log_CateID', array(分类ID))`；
- 如需排除某个分类，可使用 `array('NOT IN', 'log_CateID', array(分类ID))`。
