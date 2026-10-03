---
title: Z-BlogPHP 评论自定义方法扩展
description: 通过 Filter_Plugin_Comment_Call 接口为 Z-BlogPHP 评论对象添加自定义方法，扩展 Comment 对象能力的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Comment_Call
  - 插件接口
  - 评论
  - 自定义方法
  - 魔术方法
---

# 评论自定义方法扩展

通过 `Filter_Plugin_Comment_Call` 接口，可以为 Z-BlogPHP 的评论对象添加自定义方法：当插件或模板代码调用 Comment 对象上未定义的方法时，系统会进入本接口，由回调完成方法的具体逻辑并返回结果。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Comment_Call` | `&$comment, $method, $args` | Comment 类的魔术方法接口 |

## 完整案例

下例为评论对象定义一个自定义方法 `GetSummary($length)`，返回评论内容的纯文本摘要：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Comment_Call', 'demoAPP_Comment_Call');
}

function demoAPP_Comment_Call(&$comment, $method, $args)
{
    global $zbp;
    if ($method != 'GetSummary') {
        // 不是本插件定义的方法时立即返回
        return;
    }
    $length = isset($args[0]) ? (int) $args[0] : 30;
    $text = trim(strip_tags($comment->Content));
    if (function_exists('mb_substr')) {
        $summary = mb_substr($text, 0, $length, 'UTF-8');
    } else {
        $summary = substr($text, 0, $length);
    }
    // 置位 RETURN 信号，让本次返回值作为方法调用的结果
    $GLOBALS['Filter_Plugin_Comment_Call']['demoAPP_Comment_Call'] = PLUGIN_EXITSIGNAL_RETURN;
    return $summary;
}
```

注册后即可在插件或模板代码中调用：

```php
echo $comment->GetSummary(50);
```

## 注意事项

- 核心程序当前未调用此接口（预留接口）：只有当插件、主题或模板代码自行调用评论对象上未定义的方法时才会触发，系统流程中不会自动执行；
- 回调返回值需配合 `PLUGIN_EXITSIGNAL_RETURN` 信号才能生效，信号在每次生效后被系统重置，要在回调内每次置位（如案例写法）；不置位时返回值会被忽略；
- 多个插件都注册本接口时，系统按注册顺序逐个调用，第一个成功置位并返回的回调生效，回调开头应先判断 `$method` 是否为本插件定义的方法；
- `$args` 参数是调用时传入的实参数组，取值前建议用 `isset` 判断默认值。
