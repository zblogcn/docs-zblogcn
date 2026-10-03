---
title: Z-BlogPHP 文章页模板变量扩展
description: 通过 Filter_Plugin_ViewPost_Template 接口在 Z-BlogPHP 前台文章详情页和独立页面详情页渲染前修改模板变量或切换模板文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewPost_Template
  - 插件接口
  - 前台模板
---

# 文章页模板变量扩展

通过 `Filter_Plugin_ViewPost_Template` 接口，可以在 Z-BlogPHP 前台文章详情页和独立页面详情页渲染前修改模板变量或切换模板文件，适用于根据文章类型动态注入数据、替换默认模板等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_Template` | `Template $template` | 文章/页面详情页模板渲染前触发 |

## 完整案例

下例为文章详情页注入阅读量数据：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewPost_Template', 'demoAPP_ViewPost_Template');
}

function demoAPP_ViewPost_Template(&$template)
{
    // 读取当前文章对象
    $article = $template->GetTags('article');
    // 注入自定义变量，主题模板中可用 {$demoapp_views} 读取
    $template->SetTags('demoapp_views', $article->Metas->views ? $article->Metas->views : 0);
}
```

## 注意事项

- 参数 `$template` 为系统的 `Template` 对象，通过 `SetTags()` 注入变量、通过 `GetTags()` 读取已有变量；当前文章对象可通过 `$template->GetTags('article')` 获取；
- 该接口在系统设置好默认模板文件（如 `single`）之后、`Display()` 渲染之前触发；如需按文章类型使用不同模板，可在此调用 `$template->SetTemplate('custom_single')` 切换；
- 文章和独立页面共用该接口，只对文章生效时可判断 `$article->Type == 0`；
- 接口支持 `PLUGIN_EXITSIGNAL_RETURN` 返回值模式，返回非空值时会中断后续渲染流程，一般不做返回。
