---
title: Z-BlogPHP 模板下拉自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfTemplate 接口修改后台模板选择下拉的候选列表，隐藏指定模板文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfTemplate
  - 模板选择
  - 下拉选项
  - 插件接口
---

# 模板下拉自定义

`Filter_Plugin_OutputOptionItemsOfTemplate` 是 Z-BlogPHP `OutputOptionItemsOfTemplate()` 函数内的接口，该函数扫描当前主题已载入的模板文件，生成"模板名 => 显示文本"的候选数组后输出模板选择 `select` 下拉（文章编辑页选择正文模板、分类与页面设置等场景）。系统默认已排除 `header`、`footer`、`comment`、`sidebar`、`post-` 前缀等内部模板，接口可在最终输出前再做调整。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfTemplate` | `$default, $tz` | 定义 OutputOptionItemsOfTemplate 函数里的接口 |

## 完整案例

下例从可选模板列表中隐藏指定的模板文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfTemplate', 'demoAPP_OutputOptionItemsOfTemplate');
}

function demoAPP_OutputOptionItemsOfTemplate($default, &$tz, $refuse_file_filter, $accept_type)
{
    // $tz 的键为模板文件名（不含扩展名），按引用修改即可
    $hidden = array('single-demo', 'page-demo');
    foreach ($hidden as $name) {
        // 不影响当前正在使用的模板，避免编辑时无对应选项
        if ($name != $default) {
            unset($tz[$name]);
        }
    }
}
```

启用插件后，`single-demo` 与 `page-demo` 两个模板不再出现在后台的模板选择下拉中（除非它们正是当前值）。

## 注意事项

- 该接口属于输出期接口，在后台渲染模板选择下拉时触发，仅影响下拉显示，不校验提交值；
- 源码调用处实际传入 `$default, $tz, $refuse_file_filter, $accept_type` 四个参数，比清单多出后两个（函数自身的拒绝过滤与接受类型参数）；
- `$tz` 是"模板名 => 显示文本"数组，当前模板会带 `[当前模板]` 前缀，须声明为引用（`&$tz`）修改才能生效；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 候选列表来自 `$zbp->template->templates`（即主题模板目录与系统预置模板），模板文件增删后需重建模板才会反映到列表中。
