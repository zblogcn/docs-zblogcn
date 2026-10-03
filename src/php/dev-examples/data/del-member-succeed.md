---
title: Z-BlogPHP 会员删除后处理扩展
description: 通过 Filter_Plugin_DelMember_Succeed 接口在 Z-BlogPHP 会员删除成功后写审计日志、清理外部账号映射，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelMember_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 会员删除后处理扩展

通过 `Filter_Plugin_DelMember_Succeed` 接口，可以在 Z-BlogPHP 会员删除成功之后执行自定义逻辑。该接口在 `DelMember()` 函数内触发，此时该会员的文章、评论、附件等全部数据已按系统配置处置完毕、会员记录本身也已从数据库删除，适合做删除审计与外部账号映射清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelMember_Succeed` | `&$mem` | 会员删除成功的接口 |

## 完整案例

下例在会员删除成功后记录一条审计日志，包含被删会员的 ID、名称与级别，便于安全审计追溯：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelMember_Succeed', 'demoAPP_DelMember_Succeed');
}

function demoAPP_DelMember_Succeed(&$mem)
{
    global $zbp;

    // 删除成功后写审计日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-member.log';
    $log = date('Y-m-d H:i:s') . ' 会员删除 #' . $mem->ID
        . ' 名称=' . $mem->Name . ' 级别=' . $mem->Level
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelMember()` 中、`DelMember_AllData`（文章、评论、附件按配置删除或转移）与 `$mem->Del()` 全部完成之后；
- 两类删除不会触发本接口：删除管理员账号（`IsGod` 为 true）与删除当前登录用户自己，这两种情况系统直接跳过删除动作；
- 触发时会员已从数据库删除，但内存中的 `$mem` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 该会员名下文章与评论的处置方式由系统配置项（是否连同数据一并删除）决定，回调内不应假设其内容数据仍存在；
- 删除流程没有对应的 Core 前置接口，保存侧对应接口为 `Filter_Plugin_PostMember_Succeed`，两者分别位于删除与保存两条独立流程。
