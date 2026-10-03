---
title: Z-BlogPHP 评论审核前处理扩展
description: 通过 Filter_Plugin_CheckComment_Core 接口在 Z-BlogPHP 评论审核数据入库前记录审核动作、干预审核状态，实现审核流程管控的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_CheckComment_Core
  - 插件接口
  - 数据写入
  - 评论审核
---

# 评论审核前处理扩展

通过 `Filter_Plugin_CheckComment_Core` 接口，可以在 Z-BlogPHP 保存评论审核结果之前做最后处理。该接口在 `CheckComment()` 函数内触发，此时系统已按请求把 `$cmt->IsChecking` 置为目标状态（通过或继续待审），但尚未写入数据库。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_CheckComment_Core` | `&$cmt` | 评论审核的核心接口 |

## 完整案例

下例在审核结果保存前记录一条审核日志，标明本次操作是把评论改为通过还是驳回（继续待审）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_CheckComment_Core', 'demoAPP_CheckComment_Core');
}

function demoAPP_CheckComment_Core(&$cmt)
{
    // IsChecking 为 false 表示本次审核将评论放行，true 表示继续保持待审
    $action = $cmt->IsChecking ? '驳回（继续待审）' : '通过';

    // 记录审核日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/check.log';
    $log = date('Y-m-d H:i:s') . ' CheckComment_Core #' . $cmt->ID . ' ' . $action
        . ' 操作人：' . $GLOBALS['zbp']->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `CheckComment()` 中、`$cmt->IsChecking` 已按请求更新之后、`$cmt->Save()` 之前；若在回调中再次修改 `IsChecking`，入库的将是修改后的值；
- 参数按引用传递，回调函数签名必须写成 `&$cmt`，否则对评论对象的修改不会生效；
- 本接口与 `Filter_Plugin_CheckComment_Succeed` 是同一审核流程的前后两段：Core 在审核结果入库前触发、可改数据，Succeed 在入库后触发；注意审核状态变化引发的计数更新（文章评论数、待审数、会员评论数）发生在 Succeed 之后；
- 评论发表（而非审核）环节的对应接口是 `Filter_Plugin_PostComment_Core`，两者操作的都是 Comment 对象，注意区分场景；
- 只有 `CheckComment()` 被调用时才会触发本接口，普通发表、删除评论不会走到这里。
