---
title: Z-BlogPHP 文章保存后处理扩展
description: 通过 Filter_Plugin_PostArticle_Succeed 接口在 Z-BlogPHP 文章保存成功后写发布日志、清理缓存或同步外部服务，实现文章后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostArticle_Succeed
  - 插件接口
  - 数据写入
  - 保存后处理
---

# 文章保存后处理扩展

通过 `Filter_Plugin_PostArticle_Succeed` 接口，可以在 Z-BlogPHP 文章保存成功之后执行自定义逻辑。该接口在 `PostArticle()` 函数的末尾触发，此时文章已写入数据库、各类统计计数与相关模块重建均已完成，适合做发布通知、缓存清理、日志记录等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostArticle_Succeed` | `&$article` | 文章编辑成功的接口 |

## 完整案例

下例在每篇文章保存成功后记录一条发布日志，区分新建与更新两种情况，并按日期归档日志文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostArticle_Succeed', 'demoAPP_PostArticle_Succeed');
}

function demoAPP_PostArticle_Succeed(&$article)
{
    global $zbp;

    // 保存成功后写发布日志，此时 $article->ID 已是确定值
    $dir = $zbp->usersdir . 'plugin/demoAPP/logs/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    $action = ($article->PostTime >= time() - 5) ? '新建或更新' : '更新';
    $log = date('Y-m-d H:i:s') . ' ' . $action . ' #' . $article->ID
        . ' ' . $article->Title . ' 状态=' . $article->Status . PHP_EOL;
    file_put_contents($dir . date('Ymd') . '.log', $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostArticle()` 末尾、`$article->Save()`、标签与作者计数、分类计数、置顶统计及 `previous`、`calendar`、`comments` 等模块重建全部完成之后；
- 此时 `$article->ID` 已可用：新建文章在此前 ID 为 0，进入本接口时已拿到数据库分配的 ID，做关联记录、同步外部服务都以此为键；
- 回调中的对象参数可以声明为 `&$article` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$article->Save()`；
- 本接口与 `Filter_Plugin_PostArticle_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发、适合做后续处理；
- 每次通过文章编辑入口保存（含前台投稿等走 `PostArticle()` 的路径）都会触发，注意回调内逻辑的幂等性，避免重复通知或重复计数。
