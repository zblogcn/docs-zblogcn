---
title: Z-BlogPHP 文章删除后处理扩展
description: 通过 Filter_Plugin_DelArticle_Succeed 接口在 Z-BlogPHP 文章删除成功后写日志、清理自定义关联数据，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelArticle_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 文章删除后处理扩展

通过 `Filter_Plugin_DelArticle_Succeed` 接口，可以在 Z-BlogPHP 文章删除成功之后执行自定义逻辑。该接口在 `DelArticle()` 函数内触发，此时文章已从数据库删除、评论数据与标签、作者、分类、置顶等计数均已清理、相关模块也已重建，适合做删除留痕与关联数据清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelArticle_Succeed` | `&$article` | 文章删除成功的接口 |

## 完整案例

下例在文章删除成功后记录一条日志，包含被删文章的 ID、标题与作者，便于追溯删除操作：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelArticle_Succeed', 'demoAPP_DelArticle_Succeed');
}

function demoAPP_DelArticle_Succeed(&$article)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-article.log';
    $log = date('Y-m-d H:i:s') . ' 文章删除 #' . $article->ID
        . ' ' . $article->Title . ' 作者=' . $article->AuthorID
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelArticle()` 中、`$article->Del()`、评论数据清理、标签与作者分类等计数修正、`previous`、`calendar`、`comments` 等模块重建全部完成之后；
- 除单篇删除外，后台批量删除文章（`Include_BatchPost_Article` 内逐篇处理）同样会触发本接口，且回调发生在批量流程的模块重建之前；
- 触发时文章已从数据库删除，但内存中的 `$article` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 删除流程没有对应的 Core 前置接口，需要在删除前备份数据应使用通用的 `Filter_Plugin_DelPost_Core`；
- 本接口与 `Filter_Plugin_PostArticle_Succeed` 分别对应文章的删除与保存两条独立流程，无先后关系。
