---
title: Z-BlogPHP 文章提交前过滤扩展
description: 通过 Filter_Plugin_PostArticle_Core 接口在 Z-BlogPHP 文章数据入库前修改标题与正文，实现敏感词替换、内容校验等处理逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostArticle_Core
  - 插件接口
  - 数据写入
  - 敏感词过滤
---

# 文章提交前过滤扩展

通过 `Filter_Plugin_PostArticle_Core` 接口，可以在 Z-BlogPHP 保存文章之前对提交数据做最后处理。该接口在 `PostArticle()` 函数内触发，此时表单数据已读入 `$article` 对象，但尚未执行系统内容过滤与数据库写入，因此回调中对 `$article` 的修改会直接反映到本次保存结果中。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostArticle_Core` | `&$article` | 文章编辑的核心接口 |

## 完整案例

下例在文章保存前把正文中的敏感词替换为 `***`，并在标题命中敏感词时直接中止保存：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostArticle_Core', 'demoAPP_PostArticle_Core');
}

function demoAPP_PostArticle_Core(&$article)
{
    global $zbp;

    // 标题命中敏感词时中止保存（ShowError 会抛出异常，流程不再继续）
    $banned = array('违禁词A', '违禁词B');
    foreach ($banned as $word) {
        if (stripos($article->Title, $word) !== false) {
            $zbp->ShowError('标题包含违禁内容，保存已阻止', __FILE__, __LINE__);
        }
    }

    // 正文敏感词替换，引用传参下的修改会随本次保存入库
    $article->Content = str_ireplace($banned, '***', $article->Content);

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostArticle_Core #' . $article->ID . ' ' . $article->Title . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostArticle()` 中、`FilterMeta` 之后、`FilterPost` 与 `$article->Save()` 之前，属于入库前的最后一道可修改数据的关卡；
- 参数按引用传递，回调函数签名必须写成 `&$article`，否则对对象属性的修改只是作用于副本，不会影响保存结果；
- 本接口与 `Filter_Plugin_PostArticle_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存及统计更新完成后触发、适合做后续处理；
- 在回调内调用 `ShowError` 可以终止保存流程，适合做必填校验、违禁内容拦截等场景；
- 该接口只处理文章类型（`ZC_POST_TYPE_ARTICLE`）的提交，页面走 `Filter_Plugin_PostPage_Core`，自定义类型走 `Filter_Plugin_PostPost_Core`。
