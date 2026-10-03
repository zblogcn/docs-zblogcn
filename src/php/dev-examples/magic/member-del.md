---
title: Z-BlogPHP 用户删除联动扩展
description: 通过 Filter_Plugin_Member_Del 接口在 Z-BlogPHP 删除用户时清理插件数据、记录日志等联动操作的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Del
  - 插件接口
  - 用户
  - 删除
  - 魔术方法
---

# 用户删除联动扩展

通过 `Filter_Plugin_Member_Del` 接口，可以在 Z-BlogPHP 删除用户时执行自定义逻辑。该接口在用户对象的 `Del` 方法内部、默认数据库删除之前触发，适用于清理插件为该用户生成的数据、记录删除日志等场景。核心程序的调用点是后台删除用户操作（`DelMember` 函数）。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Del` | `&$member` | Member 类的 Del 方法接口 |

## 完整案例

下例在用户被删除时，清理插件为该用户生成的数据文件并记录日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Del', 'demoAPP_Member_Del');
}

function demoAPP_Member_Del(&$member)
{
    global $zbp;
    // 清理插件为该用户生成的数据文件
    $file = $zbp->usersdir . 'plugin/demoAPP/data/member-' . $member->ID . '.dat';
    if (file_exists($file)) {
        @unlink($file);
    }
    $log = date('Y-m-d H:i:s') . ' member deleted #' . $member->ID . ' ' . $member->Name . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/member.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 核心调用点是后台删除用户（`DelMember` 函数），系统会先删除该用户名下的文章、评论、附件，再触发本接口并删除用户记录，回调触发时用户数据仍可读取；
- 最高管理员（`IsGod`）与当前登录用户自身不会被删除，这两种情况下回调不会触发；
- 回调返回值默认无效；如需用返回值替代 `Del` 方法的返回值并跳过默认删除，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位），拦截删除需谨慎；
- 删除用户时会连带触发其名下评论、附件对象的删除接口，相关插件的清理逻辑要注意避免重复执行。
