---
title: Z-BlogPHP 附件管理页表格列扩展
description: 通过 Filter_Plugin_Admin_UploadMng_Table 接口在 Z-BlogPHP 后台附件管理列表中新增列或向操作列追加自定义按钮的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_UploadMng_Table
  - 插件接口
  - 附件管理
  - 表格列
---

# 附件管理页表格列扩展

通过 `Filter_Plugin_Admin_UploadMng_Table` 接口，可以逐行处理附件管理页列表表格，既可以新增整列，也可以直接在系统已有的操作列中追加按钮。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_UploadMng_Table` | `Upload &$upload, arr &$tabletds, arr &$tableths` | 附件管理页表格每行数据组装完成后触发 |

## 完整案例

下例不新增列，而是在每个附件行的「操作」单元格中追加一个前台打开按钮，方便直接查看附件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_UploadMng_Table', 'demoAPP_UploadMng_Table');
}

function demoAPP_UploadMng_Table(&$upload, &$tabletds, &$tableths)
{
    // 只改行、不动表头，因此不需要向 $tableths 添加内容
    // 末元素是 '</tr>'，倒数第二个元素就是「操作」单元格
    $cellIndex = count($tabletds) - 2;

    $tabletds[$cellIndex] .= '&nbsp;&nbsp;&nbsp;&;'
        . '<a href="' . htmlspecialchars($upload->Url) . '" target="_blank">'
        . '<i class="icon-link-45deg" title="打开附件"></i></a>';
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$upload` | `Upload` | 当前行对应的附件对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，倒数第二个元素是操作列单元格 |
| `$tableths` | `array` | 表头 HTML 片段数组，末元素为 `</tr>`；仅修改现有列时无需改动 |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一个附件就触发一次**；
- 三个参数均按引用传递，回调签名中的 `&` 不能省略；接口只采集回调对数组的修改，回调的返回值不会被使用；
- 系统源码中该行数组变量名为 `$ret`、表头为 `$tableHeaders`，但结构与其他管理页的 `$tabletds`、`$tableths` 完全一致，回调参数名可自定义；
- 附件 URL、文件名等字段可能包含特殊字符，拼进 HTML 时应使用 `htmlspecialchars()` 处理；
- 需要追加的是「删除、替换」等会改动数据的操作链接时，地址应通过 `BuildSafeCmdURL()` 生成以携带 CSRF Token。
