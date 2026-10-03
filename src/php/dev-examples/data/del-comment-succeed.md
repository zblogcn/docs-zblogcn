---
title: Z-BlogPHP 评论删除后处理扩展
description: 通过 Filter_Plugin_DelComment_Succeed 接口在 Z-BlogPHP 评论删除成功后写日志、同步外部审核系统，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelComment_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 评论删除后处理扩展

通过 `Filter_Plugin_DelComment_Succeed` 接口，可以在 Z-BlogPHP 评论删除成功之后执行自定义逻辑。该接口在 `DelComment()` 函数内触发，此时评论及其子评论已删除、系统评论计数与文章评论数均已修正、最新评论模块也已重建，适合做删除留痕与外部同步。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelComment_Succeed` | `&$cmt` | 评论删除成功的接口 |

## 完整案例

下例在评论删除成功后记录一条日志，包含被删评论的 ID、所属文章与作者，便于追溯删除操作：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelComment_Succeed', 'demoAPP_DelComment_Succeed');
}

function demoAPP_DelComment_Succeed(&$cmt)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-comment.log';
    $log = date('Y-m-d H:i:s') . ' 评论删除 #' . $cmt->ID
        . ' 所属文章=' . $cmt->LogID . ' 作者=' . $cmt->AuthorID
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelComment()` 中、子评论递归删除（`DelComment_Children`）、`$cmt->Del()`、评论计数与文章评论数修正、最新评论模块重建全部完成之后；
- 删除有子评论的评论时，子评论会先被递归删除，但本接口只针对发起删除的这条评论触发一次；
- 待审核与已通过的评论删除走同一入口，计数修正方式不同（`IsChecking` 为真时扣减待审数），回调内可通过 `$cmt->IsChecking` 区分被删评论删除前的状态；
- 触发时评论已从数据库删除，但内存中的 `$cmt` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 审核环节的对应接口是 `Filter_Plugin_CheckComment_Succeed`，普通发表环节是 `Filter_Plugin_PostComment_Succeed`，注意区分场景。
