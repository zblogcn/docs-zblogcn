---
title: Z-BlogPHP 作者下拉前置扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfMember_Begin 接口在作者下拉构建前预置选项，为用户列表下拉追加固定项的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfMember_Begin
  - 作者下拉
  - 下拉选项
  - 插件接口
---

# 作者下拉前置扩展

`Filter_Plugin_OutputOptionItemsOfMember_Begin` 是 Z-BlogPHP `OutputOptionItemsOfMember()` 函数内的前置接口，在该函数构建作者下拉选项的最开始触发。此时用户列表尚未加载构建，传入的 `$tz` 选项数组为空，插件可以在此预填充选项或直接接管输出。该函数生成的下拉用于文章编辑页选择作者等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfMember_Begin` | `$default, $posttype, $action, $tz` | 定义 OutputOptionItemsOfMember 函数里的前置接口 |

## 完整案例

下例在作者下拉最前面预置一个"不限作者"选项。因为后续系统构建的用户列表会继续写入同一个 `$tz` 数组，预置项会保留在输出开头：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfMember_Begin', 'demoAPP_OutputOptionItemsOfMember_Begin');
}

function demoAPP_OutputOptionItemsOfMember_Begin($default, $posttype, $checkaction, &$tz)
{
    // $tz 此时为空数组，通过引用填充的项会保留到最终输出
    $tz[0] = '不限作者';
}
```

启用插件后，后台文章编辑页的作者下拉第一项即为"不限作者"。

## 注意事项

- 该接口属于输出期接口，在后台渲染作者下拉时触发，仅影响下拉显示，不校验提交值；
- 源码调用处传入 `$default, $posttype, $checkaction, $tz` 四个参数，清单中的 `$action` 在源码中形参名为 `$checkaction`（权限动作名）；`$tz` 需声明为引用（`&$tz`）修改才能生效；
- 前置阶段 `$tz` 为空数组，后续系统会按权限把用户逐个写入 `$tz`，预置项与系统项会合并输出（键冲突时系统值生效）；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出，不再执行后续用户列表构建；
- 需要按用户等级过滤最终列表时，应改用 `Filter_Plugin_OutputOptionItemsOfMember` 接口，它在用户列表构建完成之后触发。
