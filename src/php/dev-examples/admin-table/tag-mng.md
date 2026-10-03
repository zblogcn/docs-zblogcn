---
title: Z-BlogPHP 标签管理页表格列扩展
description: 通过 Filter_Plugin_Admin_TagMng_Table 接口在 Z-BlogPHP 后台标签管理列表中新增列或向操作列追加自定义按钮（如标签合并入口）的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_TagMng_Table
  - 插件接口
  - 标签管理
  - 表格列
---

# 标签管理页表格列扩展

通过 `Filter_Plugin_Admin_TagMng_Table` 接口，可以逐行处理标签管理页列表表格，既可以新增整列，也可以直接在系统已有的操作列中追加自定义按钮。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_TagMng_Table` | `Tag &$tag, arr &$tabletds, arr &$tableths` | 标签管理页表格每行数据组装完成后触发 |

## 完整案例

下例不新增列，而是在每个标签行的「操作」单元格中追加一个「合并」按钮，把标签 ID 带给插件的合并处理页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_TagMng_Table', 'demoAPP_TagMng_Table');
}

function demoAPP_TagMng_Table(&$tag, &$tabletds, &$tableths)
{
    global $zbp;

    // 只改行、不动表头，因此不需要向 $tableths 添加内容
    // 末元素是 '</tr>'，倒数第二个元素就是「操作」单元格
    $cellIndex = count($tabletds) - 2;

    $mergeUrl = $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=merge&id=' . $tag->ID;

    $tabletds[$cellIndex] .= '&nbsp;&nbsp;&nbsp;&nbsp;'
        . '<a href="' . $mergeUrl . '" title="合并标签">'
        . '<i class="icon-puzzle-fill"></i></a>';
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$tag` | `Tag` | 当前行对应的标签对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，倒数第二个元素是操作列单元格 |
| `$tableths` | `array` | 表头 HTML 片段数组，末元素为 `</tr>`；仅修改现有列时无需改动 |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一个标签就触发一次**；
- 三个参数均按引用传递，回调签名中的 `&` 不能省略；接口只采集回调对数组的修改，回调的返回值不会被使用；
- 在操作列追加的按钮如果只是打开插件页面，直接拼接链接即可；一旦点击后会修改或删除数据，链接必须通过 `BuildSafeCmdURL()` 生成以携带 CSRF Token；
- 图标类名来自系统后台的 `icon.css`，与系统自带编辑、删除按钮使用同一套图标字体。
