---
title: Z-BlogPHP 全局模板变量注入案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Zbp_MakeTemplatetags 接口向模板标签数组注入全局变量，让所有模板都能使用的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_MakeTemplatetags
  - 模板变量
  - 插件接口
  - templateTags
---

# 全局模板变量注入

`Filter_Plugin_Zbp_MakeTemplatetags` 是 Z-BlogPHP 的生成模板标签接口，在 `Zbp::PrepareTemplate()` 创建模板对象、执行 `MakeTemplateTags()` 之后触发。回调拿到的是模板标签数组 `$template->templateTags`，可向其中注入或修改全局模板变量，注入后的变量在所有主题模板中以 `{$变量名}` 形式使用。该接口是早期预留的老接口，专用于修改 `templateTags`。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_MakeTemplatetags` | `$template` | Zbp 类的生成模板标签接口 |

## 完整案例

下例向全局模板标签注入插件名与构建时间，主题模板无需任何配合即可直接输出：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_MakeTemplatetags', 'demoAPP_Zbp_MakeTemplatetags');
}

function demoAPP_Zbp_MakeTemplatetags(&$templateTags)
{
    // 注入全局模板变量，模板中以 {$demo_app_name}、{$demo_build_date} 使用
    $templateTags['demo_app_name'] = 'demoAPP';
    $templateTags['demo_build_date'] = date('Y-m-d');

    // 也可以引用全局数据，保持变量随请求更新
    $templateTags['demo_guest_ip'] = GetGuestIP();
}
```

在主题模板任意位置写入 `{$demo_app_name}`，前台即可输出 `demoAPP`。

## 注意事项

- 该接口属于运行期接口，随 `$zbp->Load()` 每次请求都会触发（`PrepareTemplate` 在每次加载时创建模板对象），注入的变量即时生效，无需重建模板；
- 清单中的参数 `$template` 实际传入的是 `$template->templateTags` 数组而不是 `Template` 对象，回调须声明为引用（`&$templateTags`）修改才能生效；
- 回调没有返回值语义，仅通过修改 `$templateTags` 数组起作用；
- 系统已占用 `zbp`、`user`、`option`、`lang`、`modules`、`title` 等标签名，注入变量请加插件名前缀避免冲突；
- 如需在每次显示前注入仅当次请求有效的变量，或需要修改主题与模板目录，应改用 `Filter_Plugin_Template_Display` 或 `Filter_Plugin_Zbp_PrepareTemplate` 接口。
