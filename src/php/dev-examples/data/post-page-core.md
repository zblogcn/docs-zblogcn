---
title: Z-BlogPHP 页面提交前过滤扩展
description: 通过 Filter_Plugin_PostPage_Core 接口在 Z-BlogPHP 页面数据入库前自动生成摘要、规范内容，实现页面提交数据预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostPage_Core
  - 插件接口
  - 数据写入
  - 页面编辑
---

# 页面提交前过滤扩展

通过 `Filter_Plugin_PostPage_Core` 接口，可以在 Z-BlogPHP 保存页面之前对提交数据做最后处理。该接口在 `PostPage()` 函数内触发，此时表单数据已读入 `$article` 对象（页面与文章共用 Post 表存储），但尚未执行系统内容过滤与数据库写入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostPage_Core` | `&$article` | 页面编辑的核心接口 |

## 完整案例

下例在页面保存前，若作者未填写摘要则自动从正文截取首段作为摘要，并统一把正文中的全角空格替换为半角：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostPage_Core', 'demoAPP_PostPage_Core');
}

function demoAPP_PostPage_Core(&$article)
{
    // 未填写摘要时，从正文截取前 100 个字符作为摘要
    if (trim($article->Intro) == '' && $article->Content != '') {
        $text = trim(strip_tags($article->Content));
        $article->Intro = mb_substr($text, 0, 100, 'UTF-8');
    }

    // 统一替换正文中的全角空格
    $article->Content = str_replace('　', ' ', $article->Content);

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostPage_Core #' . $article->ID . ' ' . $article->Title . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostPage()` 中、`FilterMeta` 之后、`FilterPost` 与 `$article->Save()` 之前，修改会随本次保存一起入库；
- 页面对象参数名虽然叫 `$article`，但其 `Type` 属性为 `ZC_POST_TYPE_PAGE`，与文章共用 Post 表，注意不要与文章逻辑混淆处理；
- 参数按引用传递，回调函数签名必须写成 `&$article`，否则修改不会生效；
- 本接口与 `Filter_Plugin_PostPage_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存完成后触发；
- 该接口只处理页面类型提交，文章走 `Filter_Plugin_PostArticle_Core`，自定义 Post 类型走 `Filter_Plugin_PostPost_Core`。
