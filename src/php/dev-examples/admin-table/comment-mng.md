---
title: Z-BlogPHP 评论管理页表格列扩展
description: 通过 Filter_Plugin_Admin_CommentMng_Table 接口在 Z-BlogPHP 后台评论管理列表中新增自定义列或修改现有列的完整插件案例，包含第四个参数 $article 的用法。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_CommentMng_Table
  - 插件接口
  - 评论管理
  - 表格列
---

# 评论管理页表格列扩展

通过 `Filter_Plugin_Admin_CommentMng_Table` 接口，可以逐行处理评论管理页列表表格，向每行追加自定义单元格或修改系统已有的列内容。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_CommentMng_Table` | `Comment &$cmt, arr &$tabletds, arr &$tableths, Post $article` | 评论管理页表格每行数据组装完成后触发 |

## 完整案例

下例为评论列表新增一列「IP」，展示评论者提交评论时的 IP 地址：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_CommentMng_Table', 'demoAPP_CommentMng_Table');
}

function demoAPP_CommentMng_Table(&$cmt, &$tabletds, &$tableths, $article = null)
{
    // 接口每行都会触发，表头用静态变量保证只添加一次
    static $headerAdded = false;
    if (!$headerAdded) {
        // $tableths 最后一个元素是 '</tr>'，在它之前插入自定义表头
        array_splice($tableths, count($tableths) - 1, 0, array('<th>IP</th>'));
        $headerAdded = true;
    }

    // 在当前行 '</tr>' 之前插入对应单元格
    array_splice($tabletds, count($tabletds) - 1, 0, array('<td class="td10">' . htmlspecialchars($cmt->IP) . '</td>'));

    // 第四个参数 $article 是评论所属文章对象；评论对应的文章不存在时可能为空
    if ($article) {
        // 可以结合文章信息做进一步处理，例如只统计某篇文章的评论
    }
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$cmt` | `Comment` | 当前行对应的评论对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，中间是各 `<td>` |
| `$tableths` | `array` | 表头 HTML 片段数组，结构与 `$tabletds` 相同，末元素为 `</tr>` |
| `$article` | `Post` | 评论所属的文章对象，按值传入；评论对应的文章已删除或不存在时可能为空，使用前需判断 |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一条评论就触发一次**；添加表头务必用 `static` 变量（或等效判断）只执行一次，否则表头会随评论数重复增加；
- 前三个参数按引用传递，回调签名中的 `&` 不能省略；第四个 `$article` 不是引用参数，建议在回调中给一个默认值（如 `$article = null`）并先判空再使用；
- 接口只采集回调对数组的修改，回调的返回值不会被使用。
