---
title: Z-BlogPHP 模板编译开始接口扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Template_Compiling_Begin 接口在模板编译开始前注册自定义编译标签，实现主题模板私有语法扩展的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Template_Compiling_Begin
  - 模板编译
  - 插件接口
  - 自定义标签
---

# 模板编译开始接口扩展

`Filter_Plugin_Template_Compiling_Begin` 是 Z-BlogPHP 模板类的编译前置接口，在 `Template::CompileFile()` 编译单个模板文件之前触发。可在此时机修改模板源码、注册自定义编译标签。编译只发生在模板重建时，因此该接口属于编译期接口，改动需要重建模板后才生效。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Template_Compiling_Begin` | `$this, $content` | Template 类编译一个模板前的接口 |

## 完整案例

下例注册一个自定义编译标签 `{#demo_time#}`，模板重建时把它编译为输出当前时间的 PHP 代码，之后页面每次渲染都会动态执行：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Template_Compiling_Begin', 'demoAPP_Template_Compiling_Begin');
}

function demoAPP_Template_Compiling_Begin(&$template, &$content, $filename)
{
    // 把自定义标签替换为 Z-BlogPHP 模板语法，后续编译步骤会把它转换为 PHP 代码
    $content = str_replace(
        '{#demo_time#}',
        '{php} echo date("Y-m-d H:i:s"); {/php}',
        $content
    );
}
```

在主题模板文件（如 `include.php`）中写入 `{#demo_time#}`，然后重建模板，前台对应位置即会输出编译时刻之后的实时时间。

## 注意事项

- 该接口在编译期触发：只有模板重建时（进入后台、开启调试模式、后台重建模板或安装主题等操作引发重建）才会执行，前台普通访问不会触发；
- 实际调用传入三个参数 `$template, $content, $filename`，比接口清单多一个 `$filename`（模板文件名），回调第三参数按值接收即可；`$content` 必须用引用（`&$content`）修改才能生效；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接作为该文件的编译结果，跳过系统全部编译步骤，需谨慎使用；
- 该接口对每个模板文件各触发一次（批量编译时按文件循环触发），不要在回调里做耗时操作；
- 编译产物保存在 `zb_users/cache/compiled/主题名/` 目录，修改源码后必须重建模板才能看到效果。
