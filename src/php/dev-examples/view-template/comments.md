---
title: Z-BlogPHP 评论列表模板变量扩展
description: 通过 Filter_Plugin_ViewComments_Template 接口在 Z-BlogPHP 前台评论列表渲染前修改模板变量的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewComments_Template
  - 插件接口
  - 前台模板
  - 评论
---

# 评论列表模板变量扩展

通过 `Filter_Plugin_ViewComments_Template` 接口，可以在 Z-BlogPHP 前台评论列表（通过 AJAX 加载或分页切换时）渲染前修改模板变量，适用于向评论区注入自定义数据等场景。该接口在整页渲染时通常不触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewComments_Template` | `Template $template` | 评论列表模板渲染前触发 |

## 完整案例

下例在评论列表中注入当前文章评论总数，方便主题模板显示：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewComments_Template', 'demoAPP_ViewComments_Template');
}

function demoAPP_ViewComments_Template(&$template)
{
    // 注入自定义变量，主题模板中可用 {$demoapp_comment_total} 读取
    $article = $template->GetTags('article');
    $template->SetTags('demoapp_comment_total', $article->CommNums);
}
```

## 注意事项

- 参数 `$template` 为系统的 `Template` 对象，通过 `SetTags()` 注入变量、通过 `GetTags()` 读取已有变量；
- 该接口在 `ViewComments()` 函数（评论列表 AJAX 请求）中触发，模板变量包含 `article`（文章对象）、`comments`（评论数组）、`commentspagebar`（分页条）；模板文件默认为 `comments`；
- 调用后模板输出会被裁剪，只保留 `<label id="AjaxCommentBegin"></label>` 与 `<label id="AjaxCommentEnd"></label>` 之间的内容返回给前端，因此注入的变量需要在这两个标签范围内被主题模板引用。
