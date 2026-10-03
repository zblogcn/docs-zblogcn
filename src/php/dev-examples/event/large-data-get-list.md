---
title: Z-BlogPHP GetList 列表查询监听接口案例
description: 通过 Filter_Plugin_LargeData_GetList 接口修改 Z-BlogPHP GetList 函数的查询参数，实现热门文章排序与自定义列表筛选。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_LargeData_GetList
  - 插件接口
  - 大数据
  - GetList
---

# GetList 列表查询监听

`Filter_Plugin_LargeData_GetList` 挂载在主题与插件常用的文章列表函数 `GetList()` 内部，在该函数完成默认查询条件构造、执行 `$zbp->GetPostList()` 之前触发。插件可以修改本次调用的 select、where、order、count 与 option 参数，用于在大数据量场景下定制或优化 `GetList` 的查询行为。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_GetList` | `&$select, &$where, &$order, &$limit, &$option` | 大数据 GetList 函数 |

## 完整案例

下例为 `GetList` 增加约定：调用方在 option 中传入 `demoapp_hot` 标记时，列表改按浏览数倒序返回热门文章：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_LargeData_GetList', 'demoAPP_LargeData_GetList');
}

function demoAPP_LargeData_GetList(&$select, &$where, &$order, &$count, &$option)
{
    // 仅处理带有自定义标记的调用，避免影响普通 GetList 调用
    if (isset($option['demoapp_hot']) && $option['demoapp_hot']) {
        $order = array('log_ViewNums' => 'DESC');
    }
}
```

主题或插件中配合调用的方式：

```php
$hots = GetList(10, null, null, null, null, null, array('demoapp_hot' => true));
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_function.php` 的 `GetList()` 函数内，任何主题、插件调用 `GetList` 都会触发，侧栏热门文章、相关文章等模块调用频繁；
- 接口清单声明的第 4 个参数为 `$limit`，实际是整数型的数量参数 `$count`（本次取多少篇文章），并非 `array(偏移量, 条数)` 形式的分页数组，`$option` 则是 `GetList` 清理掉内部专用键之后的选项数组；
- 参数按引用传递，直接修改即可生效；本接口没有信号与返回值处理机制，无法通过返回值替换查询结果；
- 本接口无法区分是哪一段代码调用了 `GetList`，回调内应依据参数特征（如自定义 option 标记）精确圈定要介入的调用，避免改动全站所有列表的查询；
- 修改 `$order` 时优先使用有索引的字段（如 `log_ViewNums`、`log_PostTime`），数据量大的站点对 meta 值等无索引数据排序会形成慢查询。
