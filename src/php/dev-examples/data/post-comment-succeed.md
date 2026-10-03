---
title: Z-BlogPHP 评论发表后通知扩展
description: 通过 Filter_Plugin_PostComment_Succeed 接口在 Z-BlogPHP 评论发表成功后推送外部通知、写日志，实现评论后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostComment_Succeed
  - 插件接口
  - 数据写入
  - 评论通知
---

# 评论发表后通知扩展

通过 `Filter_Plugin_PostComment_Succeed` 接口，可以在 Z-BlogPHP 评论发表成功之后执行自定义逻辑。该接口在 `PostComment()` 函数的末尾触发，此时评论已写入数据库、文章评论数与系统评论计数均已更新，适合做即时通知、外部同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostComment_Succeed` | `&$cmt` | 评论发表成功的接口 |

## 完整案例

下例在评论发表成功后，把评论摘要推送到外部 Webhook 地址（如企业群机器人），并在推送失败时不影响正常流程：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostComment_Succeed', 'demoAPP_PostComment_Succeed');
}

function demoAPP_PostComment_Succeed(&$cmt)
{
    // 评论发表成功后推送 Webhook 通知
    $payload = json_encode(array(
        'msgtype' => 'text',
        'text' => array(
            'content' => '新评论 #' . $cmt->ID . ' 来自 ' . $cmt->Name . '：'
                . mb_substr(strip_tags($cmt->Content), 0, 50, 'UTF-8'),
        ),
    ), JSON_UNESCAPED_UNICODE);

    $ch = curl_init('https://example.com/webhook');
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_TIMEOUT => 3,
        CURLOPT_RETURNTRANSFER => true,
    ));
    curl_exec($ch);
    curl_close($ch);
}
```

## 注意事项

- 触发位置：在 `PostComment()` 末尾、`$cmt->Save()`、文章评论数（`CountPostArray`）、系统评论数与会员评论计数、最新评论模块重建全部完成之后；
- 仅当评论真正发表成功时触发：若站点开启评论审核且发表者无 `root` 权限，评论进入待审核队列后函数会提前返回，本接口不会触发；进入待审的评论通过审核后走的是 `Filter_Plugin_CheckComment_Succeed`；
- 此时 `$cmt->ID` 已可用，可用于构造评论页锚点链接；`$cmt->LogID` 为所属文章 ID；
- 回调中的对象参数可以声明为 `&$cmt` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$cmt->Save()`；
- Webhook 之类的外部请求务必设置较短超时并在失败时静默降级，避免拖慢发表评论的响应或造成重复通知。
