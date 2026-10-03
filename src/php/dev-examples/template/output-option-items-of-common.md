---
title: Z-BlogPHP 通用下拉选项扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfCommon 接口按 $name 区分并扩展多个通用下拉的候选选项，精简时区列表的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfCommon
  - 通用下拉
  - 下拉选项
  - 插件接口
---

# 通用下拉选项扩展

`Filter_Plugin_OutputOptionItemsOfCommon` 是 Z-BlogPHP `OutputOptionItemsOfCommon()` 函数内的通用型接口。该函数接收"键 => 显示文本"数组生成 `select` 下拉，被文章类型、时区、语言、访客 IP 获取方式等多个后台下拉复用，接口额外传入 `$name` 用于区分调用来源，是多个下拉共用的统一扩展点。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfCommon` | `$default, $array, $name` | 定义 OutputOptionItemsOfCommon 函数里的接口，因为是通用型的，所以有 $name |

## 完整案例

下例利用 `$name` 判断来源，仅把后台设置页的时区下拉精简为常用两项：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfCommon', 'demoAPP_OutputOptionItemsOfCommon');
}

function demoAPP_OutputOptionItemsOfCommon($default, &$tz, $name)
{
    // $name 标识下拉来源：Common、PostType、TimeZone、Lang、GuestIPType 等
    if ($name == 'TimeZone') {
        // 保留默认值所在项，避免当前设置无对应选项
        $tz = array(
            'Asia/Shanghai' => '+08:00',
            'UTC' => '00:00',
        );
        if (!isset($tz[$default])) {
            $tz[$default] = $default;
        }
    }
}
```

启用插件后，后台全局设置中的时区下拉只显示上海时区、UTC 与当前已设置的时区，其余下拉不受影响。

## 注意事项

- 该接口属于输出期接口，在后台上渲染对应下拉时触发（全局设置、文章类型选择等场景），仅影响下拉显示，不校验提交值；
- 源码调用处传入 `$default, $tz, $name` 三个参数，`$tz` 是"键 => 显示文本"数组，须声明为引用（`&$tz`）修改才能生效；
- `$name` 的已知取值包括 `Common`（默认）、`PostType`、`TimeZone`、`Lang`、`GuestIPType`，回调务必按 `$name` 分支处理，避免误伤其它下拉；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 由于一个回调服务多个下拉，任何对 `$tz` 的整体重建都要考虑 `$default` 的兜底，保证当前值始终有对应选项。
