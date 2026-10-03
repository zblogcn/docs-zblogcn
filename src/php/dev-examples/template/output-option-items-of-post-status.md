---
title: Z-BlogPHP 文章状态下拉自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfPostStatus 接口按权限调整文章状态下拉选项，隐藏草稿等状态的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfPostStatus
  - 文章状态
  - 下拉选项
  - 插件接口
---

# 文章状态下拉自定义

`Filter_Plugin_OutputOptionItemsOfPostStatus` 是 Z-BlogPHP `OutputOptionItemsOfPostStatus()` 函数内的接口，该函数生成后台的文章发布状态 `select` 下拉选项。默认按当前用户权限组织选项：状态 0 为公开、1 为草稿、2 为审核，无对应权限的用户只能看到受限的状态集合。接口在选项数组收集完成、输出 `option` 之前触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfPostStatus` | `$default, $tz` | 定义 OutputOptionItemsOfPostStatus 函数里的接口 |

## 完整案例

下例让非管理员用户的状态下拉中不出现"草稿"选项，只能选择公开或审核状态：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfPostStatus', 'demoAPP_OutputOptionItemsOfPostStatus');
}

function demoAPP_OutputOptionItemsOfPostStatus($default, &$tz)
{
    global $zbp;

    // 状态键：0 公开，1 草稿，2 审核；$tz 需按引用修改
    if (!$zbp->CheckRights('root')) {
        unset($tz[1]);
    }
}
```

启用插件后，非管理员在后台编辑文章时状态下拉中将不再提供"草稿"选项。

## 注意事项

- 该接口属于输出期接口，在后台渲染文章状态下拉时触发（文章编辑页、列表筛选等场景），仅影响下拉显示，不校验提交值；
- `$tz` 是"状态值 => 状态名"数组（0 公开、1 草稿、2 审核），须声明为引用（`&$tz`）修改才能生效；`$default` 是当前选中的状态值；
- 接口触发前系统已按 `ArticlePub`、`ArticleAll` 权限做过一轮过滤，回调是在此基础上的再加工；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 从下拉中移除某状态只改变界面可选范围，状态字段的最终合法性仍依赖保存时的系统权限检查。
