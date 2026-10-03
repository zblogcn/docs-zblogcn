---
title: Z-BlogPHP 大数据文章列表查询接口案例
description: 通过 Filter_Plugin_LargeData_Article 接口修改 Z-BlogPHP 文章列表查询条件与排序，实现后台与前台的列表查询定制。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_LargeData_Article
  - 插件接口
  - 大数据
  - 列表查询
---

# 大数据文章列表查询

`Filter_Plugin_LargeData_Article` 挂载在文章列表查询构造的末尾、`$zbp->GetPostList()` 执行之前。当后台文章管理页构造列表查询，或前台文章列表路由（首页、分类、标签、日期、作者等）构造查询时触发，插件可以修改查询的 select、where、order、limit 与 option 参数，用于在大数据量场景下优化查询或实现自定义筛选。接口清单声明 5 个参数，实际回调会额外收到列表类型参数。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_Article` | `&$select, &$where, &$order, &$limit, &$option` | 大数据文章接口 |

## 完整案例

下例让前台分类列表按浏览数倒序展示，并为后台文章管理列表追加自定义筛选条件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_LargeData_Article', 'demoAPP_LargeData_Article');
}

function demoAPP_LargeData_Article(&$select, &$where, &$order, &$limit, &$option, $type)
{
    // 前台路由触发时 $type 为 index、category、tag 等路由类型；后台文章管理触发时为 null
    if ($type === 'category') {
        // 分类列表按浏览数倒序
        $order = array('log_ViewNums' => 'DESC');
    }
    if ($type === null) {
        // 后台文章管理列表默认排除自定义标记的草稿
        $where[] = array('NOT LIKE', 'log_Meta', '%demoapp-hidden%');
    }
}
```

## 注意事项

- 有两个触发位置：`zb_system/function/c_system_admin.php` 的后台文章管理查询与 `zb_system/function/c_system_route.php` 的前台文章列表路由查询；只要构造文章列表查询就会触发，与站点是否启用大数据表无关，接口名源于 1.5、1.6 时代的大数据优化场景；
- 前台触发时回调收到 6 个参数，末位的 `$type` 为路由类型（`index`、`category`、`date`、`tag`、`author` 等），后台触发时该值为 `null`；接口清单声明的 5 参数对应前 5 项；
- `$limit` 在此接口中是 `array(偏移量, 条数)` 形式的数组，`$option` 中携带 `pagebar` 分页对象；若修改影响总条数，需注意分页条的计算仍按原 where 进行；
- 参数按引用传递，直接修改 `$select`、`$where`、`$order`、`$limit`、`$option` 即可生效；本接口没有信号与返回值处理机制，无法通过返回值替换查询结果；
- 该接口作用于全站所有文章列表查询，条件书写错误会直接影响前台展示与后台管理，修改前建议对 `$type` 做严格判断，`$order` 需使用索引字段（如 `log_PostTime`、`log_ViewNums`）以避免大数据量下的慢查询。
