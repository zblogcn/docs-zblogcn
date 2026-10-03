---
title: Z-BlogPHP 列表页模板变量扩展
description: 通过 Filter_Plugin_ViewList_Template 接口在 Z-BlogPHP 前台列表页（首页、分类、标签、作者页等）渲染前修改模板变量或切换模板文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewList_Template
  - 插件接口
  - 前台模板
---

# 列表页模板变量扩展

通过 `Filter_Plugin_ViewList_Template` 接口，可以在 Z-BlogPHP 前台列表页（首页、分类页、标签页、作者页等）渲染前修改模板变量或切换模板文件，适用于根据条件动态调整页面标题、注入自定义数据等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewList_Template` | `Template $template` | 列表页模板渲染前触发 |

## 完整案例

下例在首页列表中为模板注入一个自定义变量：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewList_Template', 'demoAPP_ViewList_Template');
}

function demoAPP_ViewList_Template(&$template)
{
    // 在模板中增加一个自定义变量，主题模板中可用 {$demoapp_banner} 读取
    $template->SetTags('demoapp_banner', 'zb_users/plugin/demoAPP/banner.jpg');
}
```

## 注意事项

- 参数 `$template` 为系统的 `Template` 对象，通过 `SetTags()` 注入变量、通过 `GetTags()` 读取已有变量、通过 `SetTemplate()` 切换模板文件；
- 该接口在系统设置好默认模板文件（如 `index`）之后、`Display()` 渲染之前触发，此时修改模板文件仍来得及生效；
- 列表页包含首页、分类页、标签页、作者页、日期归档页等多种类型，如需只处理某一类页面，可通过 `$template->GetTags('type')` 或 `$template->GetTags('category')` 等已有变量进行判断；
- 接口支持 `PLUGIN_EXITSIGNAL_RETURN` 返回值模式，返回非空值时会中断后续渲染流程，一般不做返回。
