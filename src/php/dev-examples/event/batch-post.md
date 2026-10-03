---
title: Z-BlogPHP 批量操作监听接口案例
description: 通过 Filter_Plugin_BatchPost 接口介入 Z-BlogPHP 后台批量删除流程，实现自定义类型批处理与关联数据清理。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_BatchPost
  - 插件接口
  - 批量操作
  - 应用管理
---

# 批量操作监听

`Filter_Plugin_BatchPost` 挂载在 Z-BlogPHP 的批量处理函数 `BatchPost()` 内部。后台文章、页面管理页的批量删除会把所选 ID 以 `$_POST['id']` 数组提交到 `cmd.php` 的 `PostBat` 动作，系统按 `type` 参数把批处理任务分发给该接口的所有回调，核心自身即通过它注册了文章与页面的批量删除实现。接口于 1.6.1 加入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_BatchPost` | `&$type` | BatchPost（1.6.1 加入） |

## 完整案例

下例在文章被批量删除时同步清理插件为每篇文章生成的静态缓存文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_BatchPost', 'demoAPP_BatchPost');
}

function demoAPP_BatchPost(&$type)
{
    global $zbp;
    // 仅处理文章类型的批量删除，页面等其他类型交回系统内置处理
    if ($type != ZC_POST_TYPE_ARTICLE || !isset($_POST['id'])) {
        return;
    }
    foreach ($_POST['id'] as $id) {
        $file = $zbp->usersdir . 'plugin/demoAPP/cache/post-' . (int) $id . '.html';
        if (is_file($file)) {
            unlink($file);
        }
    }
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_event.php` 的 `BatchPost()` 函数，调用点为 `cmd.php` 的 `PostBat` 动作，`$type` 取自 GET 参数（文章为 `ZC_POST_TYPE_ARTICLE`，页面为 `ZC_POST_TYPE_PAGE`，也可为自定义类型 ID）；
- 核心在 `$zbp->Load()` 时向本接口注册了 `Include_BatchPost_Article` 与 `Include_BatchPost_Page`，它们负责按 `$_POST['id']` 数组逐个删除内容并连带清理评论、标签计数、作者与分类统计，插件回调与它们并行执行、互不替代；
- 回调内应先判断 `$type` 是否属于自己处理的类型，避免与系统内置的批处理重复执行删除逻辑；
- 批量删除无逐条确认，回调中涉及删除、统计修正等写操作时建议自行校验当前用户对该内容的操作权限（内置实现会检查 `ArticleAll` 等权限及作者归属）；
- 本接口没有信号与返回值处理机制，回调返回值无效，无法通过返回值中断批处理流程。
