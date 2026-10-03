---
title: Z-BlogPHP 会员保存后处理扩展
description: 通过 Filter_Plugin_PostMember_Succeed 接口在 Z-BlogPHP 会员资料保存成功后写审计日志、同步外部用户系统，实现会员后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostMember_Succeed
  - 插件接口
  - 数据写入
  - 会员管理
---

# 会员保存后处理扩展

通过 `Filter_Plugin_PostMember_Succeed` 接口，可以在 Z-BlogPHP 会员资料保存成功之后执行自定义逻辑。该接口在 `PostMember()` 函数的末尾触发，此时会员数据已写入数据库、作者模块也已重建，适合做审计日志、外部用户系统同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostMember_Succeed` | `&$mem` | 会员编辑成功的接口 |

## 完整案例

下例在会员资料保存成功后记录审计日志，涵盖会员 ID、名称、级别与操作人，便于后台安全审计：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostMember_Succeed', 'demoAPP_PostMember_Succeed');
}

function demoAPP_PostMember_Succeed(&$mem)
{
    global $zbp;

    // 保存成功后写审计日志
    $file = $zbp->usersdir . 'plugin/demoAPP/member.log';
    $log = date('Y-m-d H:i:s') . ' 会员保存 #' . $mem->ID
        . ' 名称=' . $mem->Name . ' 级别=' . $mem->Level
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostMember()` 末尾、`$mem->Save()`、会员计数（非大数据模式）与 `authors` 模块重建完成之后；
- 此时 `$mem->ID` 已可用：新建会员在此前 ID 为 0，进入本接口时已拿到数据库分配的 ID，可据此区分注册与资料更新两类场景；
- 回调中的对象参数可以声明为 `&$mem` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$mem->Save()`；
- 本接口与 `Filter_Plugin_PostMember_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；
- 会员 `Password` 在入库前已加密，本接口拿到的 `Password` 属性是加密结果而非明文，做外部同步时不要把它当明文密码使用；删除会员请使用 `Filter_Plugin_DelMember_Succeed`。
