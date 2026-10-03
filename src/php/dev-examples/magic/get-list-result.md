---
title: Z-BlogPHP GetList 结果处理接口
description: 通过 Filter_Plugin_GetList_Result 接口在 Z-BlogPHP 的 GetList 函数返回列表前就地修改结果数组，如过滤隐藏指定文章。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_GetList_Result
  - GetList_Result
  - GetList
  - 插件接口
  - 数据处理
---

# GetList 结果处理接口

在 Z-BlogPHP 中，全局函数 `GetList()` 用于按分类、作者、标签、搜索等条件获取文章列表，它在返回结果之前会触发 `Filter_Plugin_GetList_Result` 接口，插件可借此对返回的文章数组做统一的就地处理，例如过滤、排序或批量附加数据。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_GetList_Result` | `&$list` | 定义 GetList 输出结果接口 |

## 完整案例

下例在 `GetList()` 返回前过滤掉设置了「列表隐藏」标记的文章：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_GetList_Result', 'demoAPP_GetList_Result');
}

function demoAPP_GetList_Result(&$list)
{
    foreach ($list as $key => $post) {
        if (isset($post->Metas->demo_hide) && $post->Metas->demo_hide) {
            unset($list[$key]);
        }
    }
    $list = array_values($list);
}
```

## 注意事项

- 触发时机在 `GetList()` 组装完结果数组之后、返回之前，侧栏文章列表、主题列表模块等使用 `GetList()` 的场景都会经过这里。
- `$list` 数组按引用传递，回调中新增、修改、删除数组元素会直接改变 `GetList()` 的返回值；回调的返回值本身会被忽略。
- 在回调中删除元素不会同步更新分页统计，`PageBar` 的总数基于查询条件计算，过滤后的实际条数可能与分页预期不一致，需要精确分页时应改用查询条件实现。
- 回调中不要调用 `GetList()` 本身，避免递归死循环。
