---
title: Z-BlogPHP 文章管理页表格列扩展
description: 通过 Filter_Plugin_Admin_ArticleMng_Table 接口在 Z-BlogPHP 后台文章管理列表中新增自定义列或修改现有列的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_ArticleMng_Table
  - 插件接口
  - 文章管理
  - 表格列
---

# 文章管理页表格列扩展

通过 `Filter_Plugin_Admin_ArticleMng_Table` 接口，可以逐行处理文章管理页列表表格，向每行追加自定义单元格（例如展示文章字数、自定义字段）或直接修改系统已有的列内容。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_ArticleMng_Table` | `Post &$article, arr &$tabletds, arr &$tableths` | 文章管理页表格每行数据组装完成后触发 |

## 完整案例

下例为文章列表新增一列「字数」，同时补充对应表头：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_ArticleMng_Table', 'demoAPP_ArticleMng_Table');
}

function demoAPP_ArticleMng_Table(&$article, &$tabletds, &$tableths)
{
    // 表头只需添加一次，接口每行都会触发，用静态变量保证只执行一次
    static $headerAdded = false;
    if (!$headerAdded) {
        // $tableths 最后一个元素是 '</tr>'，在它之前插入自定义表头
        array_splice($tableths, count($tableths) - 1, 0, array('<th>字数</th>'));
        $headerAdded = true;
    }

    // 统计正文字数（正文是 HTML，先去掉标签再按字符计数）
    $wordCount = mb_strlen(trim(strip_tags($article->Content)), 'UTF-8');

    // $tabletds 最后一个元素同样是 '</tr>'，在它之前插入对应单元格
    array_splice($tabletds, count($tabletds) - 1, 0, array('<td class="td5">' . $wordCount . '</td>'));
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$article` | `Post` | 当前行对应的文章对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，中间是各 `<td>` |
| `$tableths` | `array` | 表头 HTML 片段数组，结构与 `$tabletds` 相同，末元素为 `</tr>` |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一行文章就触发一次**；添加表头务必用 `static` 变量（或等效判断）只执行一次，否则表头会随行数重复增加；
- 三个参数均按引用传递，回调签名中的 `&` 不能省略；接口只采集回调对数组的修改，回调的返回值不会被使用；
- 只想修改已有列时无需动表头，按索引改写 `$tabletds` 对应元素即可（如标题列、操作列）；
- 插入列的位置在 `</tr>` 之前即追加到行尾；需要插到指定位置时可调整 `array_splice()` 的偏移量，并同步调整表头。
