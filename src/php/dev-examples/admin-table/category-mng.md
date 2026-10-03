---
title: Z-BlogPHP 分类管理页表格列扩展
description: 通过 Filter_Plugin_Admin_CategoryMng_Table 接口在 Z-BlogPHP 后台分类管理列表中新增自定义列或修改现有列的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_CategoryMng_Table
  - 插件接口
  - 分类管理
  - 表格列
---

# 分类管理页表格列扩展

通过 `Filter_Plugin_Admin_CategoryMng_Table` 接口，可以逐行处理分类管理页列表表格，向每行追加自定义单元格或修改系统已有的列内容。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_CategoryMng_Table` | `Category &$category, arr &$tabletds, arr &$tableths` | 分类管理页表格每行数据组装完成后触发 |

## 完整案例

下例为分类列表新增一列「子分类」，展示每个分类下直接包含的子分类数量：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_CategoryMng_Table', 'demoAPP_CategoryMng_Table');
}

function demoAPP_CategoryMng_Table(&$category, &$tabletds, &$tableths)
{
    // 接口每行都会触发，表头用静态变量保证只添加一次
    static $headerAdded = false;
    if (!$headerAdded) {
        // $tableths 最后一个元素是 '</tr>'，在它之前插入自定义表头
        array_splice($tableths, count($tableths) - 1, 0, array('<th>子分类</th>'));
        $headerAdded = true;
    }

    // SubCategories 是当前分类的直接子分类数组，系统删除按钮也据此判断
    $childCount = count($category->SubCategories);

    // 在当前行 '</tr>' 之前插入对应单元格
    array_splice($tabletds, count($tabletds) - 1, 0, array('<td class="td5 tdCenter">' . $childCount . '</td>'));
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$category` | `Category` | 当前行对应的分类对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，中间是各 `<td>` |
| `$tableths` | `array` | 表头 HTML 片段数组，结构与 `$tabletds` 相同，末元素为 `</tr>` |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一行分类就触发一次**；添加表头务必用 `static` 变量（或等效判断）只执行一次，否则表头会随行数重复增加；
- 三个参数均按引用传递，回调签名中的 `&` 不能省略；接口只采集回调对数组的修改，回调的返回值不会被使用；
- 分类管理页支持通过 `type` 参数区分文章分类和独立页面分类，插件列如需区分类型可读取 `$category->Type`（0 为文章分类，1 为独立页面分类）。
