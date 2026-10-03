---
title: Z-BlogPHP API 文章列表查询扩展
description: 通过 Filter_Plugin_API_Post_List_Core 接口在 Z-BlogPHP 的 API 文章列表查询执行前修改查询条件与返回字段的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Post_List_Core
  - 插件接口
  - API
  - 查询条件
---

# API 文章列表查询扩展

通过 `Filter_Plugin_API_Post_List_Core` 接口，可以在 Z-BlogPHP 的 API 文章列表端点（`mod=post&act=list`）查询条件组装后、`GetPostList` 执行前修改查询，适用于为 API 列表追加过滤条件、调整返回字段等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Post_List_Core` | `&$select, $where, $order, $limit, $option` | 处理 api_post_list 的查询，`$select` 为查询字段，`$where` 为查询条件数组，`$order`、`$limit`、`$option` 为排序、分页与选项 |

## 完整案例

下例在 API 文章列表中排除分类 ID 为 5 的文章，并只查询部分字段：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Post_List_Core', 'demoAPP_API_Post_List_Core');
}

function demoAPP_API_Post_List_Core(&$select, &$where, &$order, $limit, $option)
{
    // 排除指定分类
    $where[] = array('NOT IN', 'log_CateID', array(5));
    // 只查询部分字段，减小响应体积
    $select = 'log_ID, log_CateID, log_AuthorID, log_Title, log_PostTime, log_ViewNums';
}
```

## 注意事项

- 官方注释中仅 `$select` 标记为引用传递；实际调用时只要在回调签名中把需要的参数声明为引用（如 `&$where`），即可修改对应变量并影响随后的 `GetPostList` 查询，本例同时使用了 `&$select` 与 `&$where`；
- 该接口只在 `mod=post&act=list` 端点触发，此时系统已按请求参数组装好状态、分类、日期、搜索等条件，并完成了权限检查（非管理模式下已限定公开文章）；
- 修改 `$where` 将直接影响最终 SQL；追加条件时注意不要破坏系统已写入的公开可见性条件；
- `$option` 内含 `Pagebar` 分页对象，分页信息会在查询后经 `ApiGetPagebarInfo` 输出，如需追加分页字段应使用 `Filter_Plugin_API_Get_Pagination_Info` 接口。
