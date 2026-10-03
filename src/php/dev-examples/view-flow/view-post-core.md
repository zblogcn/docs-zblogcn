---
title: Z-BlogPHP 文章查询条件修改扩展
description: 通过 Filter_Plugin_ViewPost_Core 接口在 Z-BlogPHP 的 ViewPost() 查询条件组装后、GetPostList 执行前修改条件，实现排除指定分类文章、调整排序等效果的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewPost_Core
  - 插件接口
  - 前台流程监听
  - 文章页
  - 查询条件
---

# 文章查询条件修改扩展

通过 `Filter_Plugin_ViewPost_Core` 接口，可以在 Z-BlogPHP 的 `ViewPost()` 函数查询条件组装后、`GetPostList` 执行前修改查询条件，适用于排除指定分类的文章、调整相邻文章排序等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_Core` | `&$select, &$w, &$order, $limit, $option` | `ViewPost()` 查询条件组装后、`GetPostList` 执行前触发 |

## 完整案例

下例在文章页查询时排除分类 ID 为 5 的文章，访问这些文章将返回 404：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewPost_Core', 'demoAPP_ViewPost_Core');
}

function demoAPP_ViewPost_Core(&$select, &$w, &$order, $limit, $option)
{
    $w[] = array('NOT IN', 'log_CateID', array(5));
}
```

## 注意事项

- 参数 `$select`、`$w`、`$order` 需要在回调签名中使用引用传递（`&$w` 等），修改后才能对查询生效；
- 该接口只在走 `index.php` 前台入口的文章页、页面页触发，不作用于 `feed.php`、`search.php` 等独立入口；
- 修改 `$w` 等条件将直接影响最终 SQL；追加排除条件后，被排除的文章在前台访问时将查无此文；
- `$option` 为查询附加选项数组，`$limit` 为查询条数限制，一般保持原值即可。
