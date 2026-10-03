---
title: Z-BlogPHP 模板编译完成接口扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Template_Compiling_End 接口在模板编译完成后对编译结果做后处理，例如追加标记注释、压缩输出的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Template_Compiling_End
  - 模板编译
  - 插件接口
  - 编译后处理
---

# 模板编译完成接口扩展

`Filter_Plugin_Template_Compiling_End` 是 Z-BlogPHP 模板类的编译后置接口，在 `Template::CompileFile()` 内部所有编译步骤（`{php}`、`{if}`、`{foreach}`、`{for}`、`{switch}` 等标签解析完成并恢复不编译代码之后）触发，此时拿到的已经是接近最终写入磁盘的编译结果。编译只在模板重建时发生，因此该接口属于编译期接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Template_Compiling_End` | `$this, $content` | Template 类编译一个模板后的接口 |

## 完整案例

下例在每个模板文件的编译结果末尾追加一行注释，便于确认某个编译文件出自哪个版本的插件逻辑：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Template_Compiling_End', 'demoAPP_Template_Compiling_End');
}

function demoAPP_Template_Compiling_End(&$template, &$content)
{
    // 编译结果会原样写入编译后的 PHP 文件，此注释将在每次页面渲染时输出
    $content .= "\n<!-- compiled by demoAPP " . date('Y-m-d H:i:s') . " -->\n";
}
```

重建模板后，查看 `zb_users/cache/compiled/主题名/` 下的编译文件即可看到追加的注释，前台页面源码末尾也会出现该注释。

## 注意事项

- 该接口在编译期触发，仅在模板重建时执行（进入后台、开启调试模式、后台重建模板或安装主题时），改动需重建模板后才生效；
- 回调第一个参数是 `Template` 对象，第二个参数 `$content` 是完成标签解析后的编译结果，必须用引用（`&$content`）修改才能生效；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代该文件的最终编译内容；
- 与 `Filter_Plugin_Template_Compiling_Begin` 不同，此接口拿到的 `$content` 已经是 PHP 代码，再做模板标签替换不会生效，应只做字符串级后处理；
- 该接口对每个模板文件各触发一次，追加的内容会随编译文件长期存在，注意不要重复追加导致文件膨胀。
