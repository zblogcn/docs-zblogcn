---
title: Z-BlogPHP 大数据评论列表查询接口案例
description: 通过 Filter_Plugin_LargeData_Comment 接口修改 Z-BlogPHP 后台评论管理的列表查询条件与排序，实现评论列表定制。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_LargeData_Comment
  - 插件接口
  - 大数据
  - 评论管理
---

# 大数据评论列表查询

`Filter_Plugin_LargeData_Comment` 挂载在后台评论管理页（`Admin_CommentMng`）列表查询构造的末尾、`$zbp->GetCommentList()` 执行之前，插件可以修改评论管理列表的 select、where、order、limit 与 option 参数，用于在大数据量场景下优化评论列表查询或实现自定义筛选与排序。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_Comment` | `&$select, &$where, &$order, &$limit, &$option` | 大数据评论接口 |

## 完整案例

下例让后台评论管理列表默认隐藏被插件标记为垃圾的评论，保持审核工作区整洁：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_LargeData_Comment', 'demoAPP_LargeData_Comment');
}

function demoAPP_LargeData_Comment(&$select, &$where, &$order, &$limit, &$option)
{
    // 仅在未显式搜索时追加过滤，避免影响按关键词查找垃圾评论的场景
    if (!GetVars('search')) {
        $where[] = array('NOT LIKE', 'comm_Meta', '%demoapp-spam%');
    }
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_admin.php` 的后台评论管理查询处，仅当打开后台「评论管理」页时触发，前台评论列表不经过本接口；
- 评论表的字段前缀为 `comm_`（如 `comm_Meta`、`comm_IsChecking`），追加 where 条件时不要沿用文章表的 `log_` 前缀；
- 参数按引用传递，直接修改 `$select`、`$where`、`$order`、`$limit`、`$option` 即可生效；`$limit` 是 `array(偏移量, 条数)` 形式的数组，`$option` 中携带 `pagebar` 分页对象；
- 本接口没有信号与返回值处理机制，无法通过返回值替换查询结果或中断流程；
- 追加隐藏条件可能导致「列表数量与分页条统计不一致」，若插件标记了垃圾评论，建议同时在评论统计数（如 `$zbp->cache` 中的计数）上做同步修正，避免后台数量提示与列表不符。
