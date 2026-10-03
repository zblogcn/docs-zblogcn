---
title: Z-BlogPHP 模板重建流程扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Zbp_BuildTemplate 接口在重建模板前批量修改全部模板源码，实现占位符替换等全局处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_BuildTemplate
  - 模板重建
  - 插件接口
  - 模板源码
---

# 模板重建流程扩展

`Filter_Plugin_Zbp_BuildTemplate` 是 Z-BlogPHP 的重新编译模板接口，在 `Zbp::BuildTemplate()`（以及 `BuildTemplateMore()`）中、对模板源码做变更比对之前触发。回调拿到的是当前主题全部未编译模板源码组成的数组（模板名 => 源码），可以批量修改后交由系统继续比对与编译。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_BuildTemplate` | `$template` | Zbp 类的重新编译模板接口 |

## 完整案例

下例在模板重建时把所有模板源码中的 `{#demo_footer#}` 占位符替换为固定内容，实现不改主题文件即可注入的公共页脚：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_BuildTemplate', 'demoAPP_Zbp_BuildTemplate');
}

function demoAPP_Zbp_BuildTemplate(&$templates)
{
    // $templates 是未编译模板源码数组：模板名 => 源码
    foreach ($templates as $name => $content) {
        if (strpos($content, '{#demo_footer#}') !== false) {
            $templates[$name] = str_replace(
                '{#demo_footer#}',
                '<p class="demo-footer">由 demoAPP 注入的公共页脚</p>',
                $content
            );
        }
    }
}
```

在主题模板文件中写入 `{#demo_footer#}` 后重建模板，前台对应位置即输出替换后的内容。

## 注意事项

- 该接口属于编译期接口，只在模板重建时触发：进入后台、开启调试模式、后台执行重建（misc 统计任务，可强制）或安装主题时；前台普通访问不触发，改动需重建模板后生效；
- 清单中的参数 `$template` 实际传入的是 `$zbp->template->templates` 数组（模板名 => 未编译源码），回调须声明为引用（`&$templates`）修改才能生效；
- 接口之后系统会对全部模板源码求 md5 并与缓存比较，回调对源码的修改会改变 md5，从而真正触发重新编译；
- 该接口在 `BuildTemplate()` 与 `BuildTemplateMore()` 中都会触发，同一主题存在多套模板目录时会分别执行；
- 回调面向全部模板源码，注意正则与替换的性能开销，避免每次重建都处理大字符串数组。
