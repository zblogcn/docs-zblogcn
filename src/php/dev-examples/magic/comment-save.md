---
title: Z-BlogPHP 评论保存联动扩展
description: 通过 Filter_Plugin_Comment_Save 接口在 Z-BlogPHP 评论保存时执行通知推送、数据同步、保存前修正等联动逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Comment_Save
  - 插件接口
  - 评论
  - 保存
  - 魔术方法
---

# 评论保存联动扩展

通过 `Filter_Plugin_Comment_Save` 接口，可以在 Z-BlogPHP 保存评论数据时执行自定义逻辑。该接口在评论对象的 `Save` 方法内部、默认数据库写入之前触发，适用于保存记录、通知推送、保存前修正属性等场景。前台提交评论、后台审核通过、批量操作等都会触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Comment_Save` | `&$comment` | Comment 类的 Save 方法接口 |

## 完整案例

下例在每次评论保存时，把评论 ID、所属文章与操作时间记录到插件日志（可作为外部通知、数据同步的载体）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Comment_Save', 'demoAPP_Comment_Save');
}

function demoAPP_Comment_Save(&$comment)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' comment saved #' . $comment->ID . ' on post ' . $comment->LogID . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/comment.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 接口在默认数据库写入之前触发，回调内修改 `$comment` 的属性会影响即将保存的数据（如追加防灌水标记）；
- 回调返回值默认无效；如需用返回值替代 `Save` 方法的返回值并跳过默认写入，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位）；注意提交评论的流程（`PostComment`）并不检查 `Save` 的返回值，拦截保存后评论计数等后续流程仍会执行，纯拦截垃圾评论建议改用 `Filter_Plugin_PostComment_Core` 接口配合 `$comment->IsThrow` 实现；
- 后台审核（`CheckComment`）与批量操作（`BatchComment`）也会触发本接口，回调逻辑应轻量、幂等；
- 写日志前请确保插件数据目录存在（可在 `InstallPlugin_demoAPP` 中创建）。
