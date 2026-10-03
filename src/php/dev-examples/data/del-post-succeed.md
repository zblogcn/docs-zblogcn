---
title: Z-BlogPHP 通用文章删除后处理扩展
description: 通过 Filter_Plugin_DelPost_Succeed 接口在 Z-BlogPHP 删除 Post 对象成功后写删除日志、清理关联缓存，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelPost_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 通用文章删除后处理扩展

通过 `Filter_Plugin_DelPost_Succeed` 接口，可以在 Z-BlogPHP 删除任意 Post 类对象成功之后执行自定义逻辑。该接口在 `DelPost()` 函数内触发，此时对象已从数据库删除、评论计数已清理、导航栏项已移除，是 1.7.0 加入的通用删除出口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelPost_Succeed` | `&$post` | Post 类对象的通用删除成功接口（1.7.0 加入） |

## 完整案例

下例在删除成功后记录一条删除日志，包含被删对象的 ID、类型与标题，便于追溯删除操作：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelPost_Succeed', 'demoAPP_DelPost_Succeed');
}

function demoAPP_DelPost_Succeed(&$post)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del.log';
    $log = date('Y-m-d H:i:s') . ' 删除 #' . $post->ID
        . ' Type=' . $post->Type . ' ' . $post->Title
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelPost()` 中、`$post->Del()`、文章评论数据清理（`DelArticle_Comments`）与导航栏项移除完成之后；
- 触发时对象已从数据库删除，但内存中的 `$post` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 参数按引用传递，回调函数签名可写成 `&$post`；与本流程前段的 `Filter_Plugin_DelPost_Core`（删除前触发，适合备份）配合可实现删除留痕的完整闭环；
- 只有走通用 `DelPost()` 的删除流程才会触发本接口；文章、页面的专用删除函数 `DelArticle()`、`DelPage()` 分别使用 `Filter_Plugin_DelArticle_Succeed`、`Filter_Plugin_DelPage_Succeed`；
- 若 `Post` 对象的 ID 不存在（`$post->ID` 为 0），整个删除流程会直接跳过，本接口不会触发。
