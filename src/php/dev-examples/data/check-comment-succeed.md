---
title: Z-BlogPHP 评论审核后处理扩展
description: 通过 Filter_Plugin_CheckComment_Succeed 接口在 Z-BlogPHP 评论审核结果入库后写审核日志、推送通知，实现审核后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_CheckComment_Succeed
  - 插件接口
  - 数据写入
  - 评论审核
---

# 评论审核后处理扩展

通过 `Filter_Plugin_CheckComment_Succeed` 接口，可以在 Z-BlogPHP 评论审核结果保存成功之后执行自定义逻辑。该接口在 `CheckComment()` 函数内触发，此时审核状态已写入数据库，但审核状态变化引发的计数更新尚未执行，适合做审核通知、审计日志等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_CheckComment_Succeed` | `&$cmt` | 评论审核成功的接口 |

## 完整案例

下例在评论审核结果保存后写一条审核日志，标明审核结论与操作人，便于站长追溯审核记录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_CheckComment_Succeed', 'demoAPP_CheckComment_Succeed');
}

function demoAPP_CheckComment_Succeed(&$cmt)
{
    global $zbp;

    // IsChecking 为 false 表示审核通过，true 表示驳回（继续待审）
    $result = $cmt->IsChecking ? '驳回' : '通过';

    $file = $zbp->usersdir . 'plugin/demoAPP/check.log';
    $log = date('Y-m-d H:i:s') . ' 审核 #' . $cmt->ID . ' 结论=' . $result
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `CheckComment()` 中、`$cmt->Save()` 之后；注意审核状态变化引发的计数更新（文章评论数、待审数、会员评论数）在本接口之后才执行，回调内读取的计数类属性可能是旧值；
- 回调中的对象参数可以声明为 `&$cmt` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$cmt->Save()`；
- 本接口与 `Filter_Plugin_CheckComment_Core` 是同一审核流程的前后两段：Core 在审核结果入库前触发、可改数据，Succeed 在入库后触发；
- 该接口只在审核动作（后台通过或驳回待审评论）时触发，评论的普通发表走 `Filter_Plugin_PostComment_Succeed`，删除走 `Filter_Plugin_DelComment_Succeed`，注意区分；
- 审核通过后系统会自动完成计数补偿，回调内不要再手动调整 `CountCommentNums` 等系统计数，否则会出现重复计数。
