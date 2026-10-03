---
title: Z-BlogPHP 评论删除联动扩展
description: 通过 Filter_Plugin_Comment_Del 接口在 Z-BlogPHP 删除评论时清理关联数据、记录日志等联动操作的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Comment_Del
  - 插件接口
  - 评论
  - 删除
  - 魔术方法
---

# 评论删除联动扩展

通过 `Filter_Plugin_Comment_Del` 接口，可以在 Z-BlogPHP 删除评论时执行自定义逻辑。该接口在评论对象的 `Del` 方法内部、默认数据库删除之前触发，适用于清理插件为该评论生成的关联数据、记录删除日志等场景。后台删除评论、递归删除子评论、批量删除等操作都会触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Comment_Del` | `&$comment` | Comment 类的 Del 方法接口 |

## 完整案例

下例在评论被删除时，记录删除日志（可作为同步清理外部系统数据的依据）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Comment_Del', 'demoAPP_Comment_Del');
}

function demoAPP_Comment_Del(&$comment)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' comment deleted #' . $comment->ID . ' (post ' . $comment->LogID . ')' . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/comment.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 删除带子评论的评论时，系统会递归删除其全部子评论，每个子评论的 `Del` 方法都会单独触发本接口，批量删除场景下回调会被多次调用；
- 回调触发时评论数据尚未删除，仍可读取 `ID`、`LogID`、`AuthorID` 等属性；
- 回调返回值默认无效；如需用返回值替代 `Del` 方法的返回值并跳过默认删除，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位），拦截删除需谨慎；
- 删除评论后系统会同步更新文章评论数与作者评论数统计，插件清理逻辑不必重复处理计数。
