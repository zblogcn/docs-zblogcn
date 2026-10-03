---
title: Z-BlogPHP 用户管理页表格列扩展
description: 通过 Filter_Plugin_Admin_MemberMng_Table 接口在 Z-BlogPHP 后台用户管理列表中新增自定义列（如用户扩展资料）或修改现有列的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_MemberMng_Table
  - 插件接口
  - 用户管理
  - 表格列
---

# 用户管理页表格列扩展

通过 `Filter_Plugin_Admin_MemberMng_Table` 接口，可以逐行处理用户管理页列表表格，向每行追加自定义单元格或修改系统已有的列内容。该接口自 Z-BlogPHP 1.5.1 起提供。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_MemberMng_Table` | `Member &$member, arr &$tabletds, arr &$tableths` | 用户管理页表格每行数据组装完成后触发 |

## 完整案例

下例为用户列表新增一列「手机号」，数据取自插件给用户保存的扩展字段（Meta）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_MemberMng_Table', 'demoAPP_MemberMng_Table');
}

function demoAPP_MemberMng_Table(&$member, &$tabletds, &$tableths)
{
    // 接口每行都会触发，表头用静态变量保证只添加一次
    static $headerAdded = false;
    if (!$headerAdded) {
        // $tableths 最后一个元素是 '</tr>'，在它之前插入自定义表头
        array_splice($tableths, count($tableths) - 1, 0, array('<th>手机号</th>'));
        $headerAdded = true;
    }

    // 用户未填写该扩展字段时 Metas 中不存在对应键，需要给默认值
    $mobile = isset($member->Metas->mobile) ? htmlspecialchars($member->Metas->mobile) : '';

    // 在当前行 '</tr>' 之前插入对应单元格
    array_splice($tabletds, count($tabletds) - 1, 0, array('<td class="td10">' . $mobile . '</td>'));
}
```

## 参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `$member` | `Member` | 当前行对应用户对象（引用传入） |
| `$tabletds` | `array` | 当前行的 HTML 片段数组，首元素为 `<tr>`，末元素为 `</tr>`，中间是各 `<td>` |
| `$tableths` | `array` | 表头 HTML 片段数组，结构与 `$tabletds` 相同，末元素为 `</tr>` |

## 注意事项

- 接口位于列表的 `foreach` 循环内，**每输出一个用户就触发一次**；添加表头务必用 `static` 变量（或等效判断）只执行一次，否则表头会随用户数重复增加；
- 三个参数均按引用传递，回调签名中的 `&` 不能省略；接口只采集回调对数组的修改，回调的返回值不会被使用；
- 读取用户扩展字段（Meta）时要先判断键是否存在，未填写资料的用户不会自动拥有默认值。
