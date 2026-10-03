---
title: Z-BlogPHP 模板显示阶段扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Template_Display 接口在模板渲染前注入运行期变量或切换本次渲染模板的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Template_Display
  - 模板显示
  - 插件接口
  - 模板变量
---

# 模板显示阶段扩展

`Filter_Plugin_Template_Display` 是 Z-BlogPHP 模板类的显示接口，在 `Template::Display()` 中、`include` 编译模板文件之前触发。此时模块内容已完成静态标签替换，接口回调可以向本次渲染注入变量，甚至更换入口模板。前台每次渲染页面（文章页、列表页、搜索页、外链跳转页等最终都走 `Display`）都会触发该接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Template_Display` | `$this, $entryPage` | Template 类显示接口 |

## 完整案例

下例在每次页面显示前注入一个运行期模板变量，并演示按入口模板名做条件处理：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Template_Display', 'demoAPP_Template_Display');
}

function demoAPP_Template_Display(&$template, &$entryPage)
{
    // 注入运行期变量，模板中用 {$demo_runtime} 输出
    $template->SetTags('demo_runtime', '由 demoAPP 在显示阶段注入');

    // 也可按入口模板名做条件处理，例如仅在首页时额外注入
    if ($entryPage == 'index') {
        $template->SetTags('demo_index_tip', '这是首页专属变量');
    }

    // 如需更换本次渲染的模板，直接修改 $entryPage（第二参数需声明为引用）
    // $entryPage = 'single';
}
```

在主题模板任意位置写入 `{$demo_runtime}`，前台即可看到输出；变量只在本次请求有效，不会写入编译文件。

## 注意事项

- 该接口属于输出期接口，每次模板显示都会触发（包括后台部分使用模板渲染的场景），回调应保持轻量，避免影响页面性能；
- 第一参数是 `Template` 对象，可通过 `SetTags` 注入模板变量、`GetTags` 读取已有变量；第二参数 `$entryPage` 是本次渲染的入口模板名，声明为引用（`&$entryPage`）后修改它可以更换本次渲染的模板；
- 在此注入的变量是运行期的，每次请求都要重新注入，不需要重建模板；
- 修改 `$entryPage` 前请确认目标模板存在，否则会因编译文件不可读而触发系统错误（错误码 86）；
- 该接口触发时模块内容刚完成静态标签替换，此时修改模块内容已来不及影响本次渲染，如需处理模块内容应更早介入。
