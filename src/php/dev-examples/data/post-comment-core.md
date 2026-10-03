---
title: Z-BlogPHP 评论发表前拦截扩展
description: 通过 Filter_Plugin_PostComment_Core 接口在 Z-BlogPHP 评论入库前做黑名单词拦截、内容改写等预处理，实现反垃圾评论的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostComment_Core
  - 插件接口
  - 数据写入
  - 评论拦截
---

# 评论发表前拦截扩展

通过 `Filter_Plugin_PostComment_Core` 接口，可以在 Z-BlogPHP 发表评论前对评论对象做最后检查与改写。该接口在 `PostComment()` 函数内触发，此时评论数据已读入 `$cmt` 对象，但尚未执行系统过滤函数 `FilterComment`，也未写入数据库。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostComment_Core` | `&$cmt` | 评论发表的核心接口 |

## 完整案例

下例在评论发表前检查黑名单关键词，命中时置 `$cmt->IsThrow = true` 阻止评论入库，否则把评论内容中的敏感词替换掉：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostComment_Core', 'demoAPP_PostComment_Core');
}

function demoAPP_PostComment_Core(&$cmt)
{
    // 命中黑名单词时丢弃评论
    $blacklist = array('赌博', '代开发票');
    foreach ($blacklist as $word) {
        if (stripos($cmt->Content, $word) !== false) {
            $cmt->IsThrow = true;
            return;
        }
    }

    // 普通敏感词替换
    $cmt->Content = str_ireplace(array('敏感词'), '***', $cmt->Content);

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostComment_Core #' . $cmt->ID . ' LogID=' . $cmt->LogID . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostComment()` 中、系统过滤函数 `FilterComment` 之前、`$cmt->Save()` 之前；`FilterComment` 执行后若检测到 `IsThrow` 为 `true`，系统会中止发表并返回错误，因此在本接口中置 `IsThrow` 可以阻止评论入库；
- 参数按引用传递，回调函数签名必须写成 `&$cmt`，否则对评论对象的修改不会生效；
- 本接口与 `Filter_Plugin_PostComment_Succeed` 是同一发表流程的前后两段：Core 在入库前触发、可拦截或改写，Succeed 在入库及计数完成后触发；
- 该接口只拦截普通发表流程，若站点开启了评论审核且发表者无 `root` 权限，评论会进入待审核队列，此时同样会先经过本接口；
- 需要在评论审核环节做处理时，应使用 `Filter_Plugin_CheckComment_Core` 接口，两者操作的都是 Comment 对象。
