---
title: Z-BlogPHP 大数据页面列表查询接口案例
description: 通过 Filter_Plugin_LargeData_Page 接口修改 Z-BlogPHP 后台页面管理的列表查询条件与排序，实现页面列表定制。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_LargeData_Page
  - 插件接口
  - 大数据
  - 页面管理
---

# 大数据页面列表查询

`Filter_Plugin_LargeData_Page` 挂载在后台页面管理页（`Admin_PageMng`）列表查询构造的末尾、`$zbp->GetPostList()` 执行之前，插件可以修改页面管理列表的 select、where、order、limit 与 option 参数，用于在大数据量场景下优化页面列表查询或实现自定义筛选与排序。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_Page` | `&$select, &$where, &$order, &$limit, &$option` | 大数据页面接口 |

## 完整案例

下例让后台页面管理列表在默认排序基础上改为按创建时间倒序，并排除带自定义标记的内部页面：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_LargeData_Page', 'demoAPP_LargeData_Page');
}

function demoAPP_LargeData_Page(&$select, &$where, &$order, &$limit, &$option)
{
    // 按创建时间倒序展示
    $order = array('log_PostTime' => 'DESC');
    // 排除插件标记为内部使用的页面
    $where[] = array('NOT LIKE', 'log_Meta', '%demoapp-internal%');
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_admin.php` 的后台页面管理查询处，仅当打开后台「页面管理」页时触发，前台页面路由不经过本接口；
- 参数按引用传递，直接修改 `$select`、`$where`、`$order`、`$limit`、`$option` 即可生效；`$limit` 是 `array(偏移量, 条数)` 形式的数组，`$option` 中携带 `pagebar` 分页对象；
- 本接口没有信号与返回值处理机制，无法通过返回值替换查询结果或中断流程；
- 追加 where 条件会影响列表总条数，但分页条按原有查询统计生成，二者可能出现不一致，修改查询条件时建议同步评估分页展示；
- 排序字段应选择有索引的列（如 `log_PostTime`、`log_ID`），在页面数量较大的站点上对无索引字段（如 meta 内的值）排序会显著增加数据库负载。
