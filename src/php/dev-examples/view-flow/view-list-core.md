---
title: Z-BlogPHP 列表查询条件修改扩展
description: 通过 Filter_Plugin_ViewList_Core 接口在 Z-BlogPHP 的 ViewList() 查询条件组装后、查询执行前修改条件，实现按类型调整列表内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewList_Core
  - 插件接口
  - 前台流程监听
  - 列表查询
  - 查询条件
---

# 列表查询条件修改扩展

通过 `Filter_Plugin_ViewList_Core` 接口，可以在 Z-BlogPHP 的 `ViewList()` 函数查询条件组装后、查询执行前修改查询条件，适用于按页面类型过滤文章、调整排序等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewList_Core` | `$type, $page, $category, $author, $datetime, $tag, &$w, &$pagebar, &$list_template` | `ViewList()` 查询条件组装后、查询执行前触发 |

## 完整案例

下例在首页列表中排除分类 ID 为 5 的文章，其他类型列表不受影响：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewList_Core', 'demoAPP_ViewList_Core');
}

function demoAPP_ViewList_Core($type, $page, $category, $author, $datetime, $tag, &$w, &$pagebar, &$list_template)
{
    // 只处理首页列表
    if ($type == 'index') {
        $w[] = array('NOT IN', 'log_CateID', array(5));
    }
}
```

## 注意事项

- 参数 `$w`、`$pagebar`、`$list_template` 需要在回调签名中使用引用传递（`&$w` 等），修改后才能对查询生效；
- 该接口只在走 `index.php` 前台入口的列表页触发，不作用于 `feed.php`、`search.php` 等独立入口；
- 修改 `$w` 等条件将直接影响最终 SQL；`$type` 可取 `index`、`category`、`tag`、`author`、`date` 等值，用它可以只对某类列表做处理；
- 修改 `$pagebar` 可调整分页参数，修改 `$list_template` 可切换列表使用的模板名。
