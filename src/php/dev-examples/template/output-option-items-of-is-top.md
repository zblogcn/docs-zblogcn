---
title: Z-BlogPHP 置顶状态下拉自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfIsTop 接口调整文章置顶状态下拉选项，按权限限制置顶方式的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfIsTop
  - 置顶状态
  - 下拉选项
  - 插件接口
---

# 置顶状态下拉自定义

`Filter_Plugin_OutputOptionItemsOfIsTop` 是 Z-BlogPHP `OutputOptionItemsOfIsTop()` 函数内的接口，该函数生成后台文章编辑页的置顶状态 `select` 下拉选项，默认包含：无（0）、首页置顶（2）、全局置顶（1）、分类置顶（4）。接口在选项数组收集完成、输出 `option` 之前触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfIsTop` | `$default, $tz` | 定义 OutputOptionItemsOfIsTop 函数里的接口 |

## 完整案例

下例让非管理员用户在置顶下拉中看不到"全局置顶"选项，只保留首页置顶与分类置顶：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfIsTop', 'demoAPP_OutputOptionItemsOfIsTop');
}

function demoAPP_OutputOptionItemsOfIsTop($default, &$tz)
{
    global $zbp;

    // 置顶键：0 无，1 全局置顶，2 首页置顶，4 分类置顶；$tz 需按引用修改
    if (!$zbp->CheckRights('root')) {
        unset($tz[1]);
    }
}
```

启用插件后，非管理员在后台编辑文章时无法通过下拉选择"全局置顶"。

## 注意事项

- 该接口属于输出期接口，在后台渲染置顶状态下拉时触发（文章编辑页等场景），仅影响下拉显示，不校验提交值；
- `$tz` 是"置顶值 => 置顶名"数组，键来自 `$zbp->lang['msg']` 中的 `none`、`top_index`、`top_global`、`top_categorys` 等语言项，须声明为引用（`&$tz`）修改才能生效；
- `$default` 是当前文章的置顶值，过滤选项时建议保留 `$default` 对应项，避免当前值在界面上无对应选项；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 置顶状态是文章属性之一，界面过滤不影响直接提交数据的绕过行为，权限控制仍应以保存流程的检查为准。
