---
title: Z-BlogPHP 搜索查询条件修改扩展
description: 通过 Filter_Plugin_ViewSearch_Core 接口在 Z-BlogPHP 的 ViewSearch() 查询条件组装后、查询执行前修改条件，实现限制搜索范围、调整排序等效果的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewSearch_Core
  - 插件接口
  - 前台流程监听
  - 搜索
  - 查询条件
---

# 搜索查询条件修改扩展

通过 `Filter_Plugin_ViewSearch_Core` 接口，可以在 Z-BlogPHP 的 `ViewSearch()` 函数查询条件组装后、查询执行前修改查询条件，适用于限制搜索范围（如只搜标题）、调整搜索结果排序等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewSearch_Core` | `$q, $page, &$w, &$pagebar, &$order` | `ViewSearch()` 查询条件组装后、查询执行前触发 |

## 完整案例

下例限制搜索只在文章标题中匹配关键词，不再匹配正文：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewSearch_Core', 'demoAPP_ViewSearch_Core');
}

function demoAPP_ViewSearch_Core($q, $page, &$w, &$pagebar, &$order)
{
    // 重建关键词条件：只在标题中搜索
    foreach ($w as $k => $v) {
        if (is_array($v) && isset($v[1]) && in_array($v[1], array('log_Title', 'log_Content', 'log_Intro'))) {
            unset($w[$k]);
        }
    }
    $w[] = array('LIKE', 'log_Title', '%' . $q . '%');
}
```

## 注意事项

- 参数 `$w`、`$pagebar`、`$order` 需要在回调签名中使用引用传递（`&$w` 等），修改后才能对查询生效；
- 该接口只在 `search.php` 入口触发，不作用于 `index.php`、`feed.php` 等其他入口；
- 修改 `$w` 等条件将直接影响最终 SQL；默认搜索会同时匹配标题、摘要与正文，重建条件时注意保留原有的其他限制（如文章状态）；
- 修改 `$order` 可调整搜索结果排序方式，例如改为按浏览量排序。
