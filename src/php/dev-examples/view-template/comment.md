---
title: Z-BlogPHP 单条评论模板变量扩展
description: 通过 Filter_Plugin_ViewComment_Template 接口在 Z-BlogPHP 前台单条评论渲染前修改模板变量的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewComment_Template
  - 插件接口
  - 前台模板
  - 评论
---

# 单条评论模板变量扩展

通过 `Filter_Plugin_ViewComment_Template` 接口，可以在 Z-BlogPHP 前台单条评论（通过 AJAX 提交后刷新单条评论时）渲染前修改模板变量，适用于为单条评论动态注入数据（如楼层号、用户等级标识等）的场景。该接口在整页渲染时通常不触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewComment_Template` | `Template $template` | 单条评论模板渲染前触发 |

## 完整案例

下例为单条评论注入「作者回复」标识，方便主题模板对文章作者的评论做特殊标记：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewComment_Template', 'demoAPP_ViewComment_Template');
}

function demoAPP_ViewComment_Template(&$template)
{
    $comment = $template->GetTags('comment');
    $article = $template->GetTags('article');
    // 评论者与文章作者为同一人时标记为作者回复，主题模板中可用 {$demoapp_isauthor} 判断
    $template->SetTags('demoapp_isauthor', ($comment->AuthorID == $article->AuthorID));
}
```

## 注意事项

- 参数 `$template` 为系统的 `Template` 对象，通过 `SetTags()` 注入变量、通过 `GetTags()` 读取已有变量；当前评论对象可通过 `$template->GetTags('comment')` 获取；
- 该接口在 `ViewComment()` 函数（单条评论展示，常用于 AJAX 提交评论后刷新单条评论）中触发，模板变量包含 `comment`（评论对象）、`article`（文章对象）；模板文件默认为 `comment`；
- 同一页面有多少条评论就会触发多少次，回调中应避免执行耗时操作。
