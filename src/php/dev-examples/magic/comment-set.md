---
title: Z-BlogPHP 评论属性写入监听扩展
description: 通过 Filter_Plugin_Comment_Set 接口监听 Z-BlogPHP 评论对象属性赋值，实现评论内容修改记录等写入监控的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Comment_Set
  - 插件接口
  - 评论
  - 写入监听
  - 魔术方法
---

# 评论属性写入监听扩展

通过 `Filter_Plugin_Comment_Set` 接口，可以在 Z-BlogPHP 对评论对象进行属性赋值时得到通知，适用于写入审计、数据联动等场景。对 Comment 对象任何属性的赋值（如前台提交评论、后台审核修改）都会先触发本接口，之后再由系统写入默认存储。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Comment_Set` | `&$comment, $name, $value` | 干预 Comment 类 Set 方法的接口 |

## 完整案例

下例监听评论内容字段的写入，把每次内容变更记录到插件日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Comment_Set', 'demoAPP_Comment_Set');
}

function demoAPP_Comment_Set(&$comment, $name, $value)
{
    global $zbp;
    if ($name != 'Content') {
        return;
    }
    $log = date('Y-m-d H:i:s') . ' comment #' . $comment->ID . ' content written, length ' . strlen($value) . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/comment.log', $log, FILE_APPEND);
}
```

## 注意事项

- 对评论对象任何属性的赋值都会触发本接口（包括 `Content`、`Name`、`Email` 等正常数据字段），赋值完成后系统仍会执行默认写入，回调无法阻止或修改本次写入的值（`$value` 是值拷贝）；
- `Author`、`Comments`、`Level`、`Post`、`Parent` 是只读虚拟属性，对其赋值会被系统直接忽略，不触发本接口；
- 本接口没有返回值语义，注册时无需设置 `PLUGIN_EXITSIGNAL_RETURN` 信号；
- 前台提交评论、后台编辑审核、批量操作等都会触发属性写入，日志等回调逻辑应尽量轻量；
- 评论内容中可能包含任意用户输入，写入日志前建议只记录长度、时间等元信息，避免敏感内容落盘。
