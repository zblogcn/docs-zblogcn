---
title: Z-BlogPHP 会员提交前校验扩展
description: 通过 Filter_Plugin_PostMember_Core 接口在 Z-BlogPHP 会员数据入库前校验简介、规范主页地址，实现会员提交数据预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostMember_Core
  - 插件接口
  - 数据写入
  - 会员编辑
---

# 会员提交前校验扩展

通过 `Filter_Plugin_PostMember_Core` 接口，可以在 Z-BlogPHP 保存会员之前对提交数据做最后处理。该接口在 `PostMember()` 函数内触发，此时表单数据（含密码的独立处理）已读入 `$mem` 对象，但尚未执行系统过滤与数据库写入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostMember_Core` | `&$mem` | 会员编辑的核心接口 |

## 完整案例

下例在会员保存前规范个人主页地址（无协议时自动补全 `https://`），并把超长的简介截断到 200 个字符：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostMember_Core', 'demoAPP_PostMember_Core');
}

function demoAPP_PostMember_Core(&$mem)
{
    // 主页地址规范化：非空且无协议头时补全 https://
    if ($mem->HomePage != '' && !preg_match('/^https?:\/\//i', $mem->HomePage)) {
        $mem->HomePage = 'https://' . $mem->HomePage;
    }

    // 简介超长截断
    if (mb_strlen($mem->Intro, 'UTF-8') > 200) {
        $mem->Intro = mb_substr($mem->Intro, 0, 200, 'UTF-8');
    }

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostMember_Core #' . $mem->ID . ' ' . $mem->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostMember()` 中、密码独立处理与 `FilterMeta` 之后、`FilterMember` 与 `$mem->Save()` 之前，修改会随本次保存一起入库；
- 参数按引用传递，回调函数签名必须写成 `&$mem`，否则对会员对象的修改不会生效；
- 本接口与 `Filter_Plugin_PostMember_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存与作者模块重建完成后触发；
- 密码字段在进入本接口前已由系统单独加密处理，不要在回调中直接改动 `Password` 属性；
- 同名检查（`CheckMemberNameExist`）发生在本接口之后，新建会员时在此处修改 `Name` 存在绕过重名检查的风险，不建议改动该字段。
