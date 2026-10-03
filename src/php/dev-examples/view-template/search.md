---
title: Z-BlogPHP 搜索结果页模板变量扩展
description: 通过 Filter_Plugin_ViewSearch_Template 接口在 Z-BlogPHP 前台搜索结果页渲染前修改模板变量或切换模板文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewSearch_Template
  - 插件接口
  - 前台模板
  - 搜索
---

# 搜索结果页模板变量扩展

通过 `Filter_Plugin_ViewSearch_Template` 接口，可以在 Z-BlogPHP 前台搜索结果页渲染前修改模板变量或切换模板文件，适用于向搜索结果页注入自定义数据、调整搜索页标题等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewSearch_Template` | `Template $template` | 搜索结果页模板渲染前触发 |

## 完整案例

下例在搜索结果页中注入搜索关键词，方便主题模板显示：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewSearch_Template', 'demoAPP_ViewSearch_Template');
}

function demoAPP_ViewSearch_Template(&$template)
{
    // 注入自定义变量，主题模板中可用 {$demoapp_keyword} 读取
    $template->SetTags('demoapp_keyword', GetVars('q', 'GET'));
}
```

## 注意事项

- 参数 `$template` 为系统的 `Template` 对象，通过 `SetTags()` 注入变量、通过 `GetTags()` 读取已有变量、通过 `SetTemplate()` 切换模板文件；
- 该接口在系统设置好默认模板文件（如 `search`）之后、`Display()` 渲染之前触发；
- 搜索关键词通过 `GetVars('q', 'GET')` 获取，如需在结果页显示当前搜索词，可在本接口中注入；
- 接口支持 `PLUGIN_EXITSIGNAL_RETURN` 返回值模式，返回非空值时会中断后续渲染流程，一般不做返回。
