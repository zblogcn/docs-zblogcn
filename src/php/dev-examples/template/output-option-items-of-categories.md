---
title: Z-BlogPHP 分类下拉自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfCategories 接口修改后台分类下拉选项，追加特殊选项或过滤分类的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfCategories
  - 分类下拉
  - 下拉选项
  - 插件接口
---

# 分类下拉自定义

`Filter_Plugin_OutputOptionItemsOfCategories` 是 Z-BlogPHP `OutputOptionItemsOfCategories()` 函数内的接口，该函数按分类层级生成后台的分类 `select` 下拉选项（选项文本为带层级符号的 `SymbolName`）。接口在选项数组收集完成、输出 `option` 之前触发，可追加或过滤分类选项。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfCategories` | `$default, $tz` | 定义 OutputOptionItemsOfCategories 函数里的接口 |

## 完整案例

下例在分类下拉末尾追加一个"不限分类"选项（键为 0），供筛选表单等场景使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfCategories', 'demoAPP_OutputOptionItemsOfCategories');
}

function demoAPP_OutputOptionItemsOfCategories($default, &$tz, $type)
{
    // $tz 的键为分类 ID，值为带层级符号的分类名，按引用修改即可
    $tz[0] = '不限分类';
}
```

启用插件后，后台所有使用该函数输出的分类下拉末尾都会出现"不限分类"选项。

## 注意事项

- 该接口属于输出期接口，在后台渲染分类下拉时触发（文章编辑页、模块编辑页、各类筛选表单等场景），仅影响下拉显示，不校验提交值；
- 源码调用处实际传入 `$default, $tz, $type` 三个参数，比清单多出 `$type`（分类类型，与 `OutputOptionItemsOfCategories($default, $type)` 的第二参数一致）；
- `$tz` 是"分类 ID => 分类名"数组，须声明为引用（`&$tz`）修改才能生效；选项按数组顺序输出，键 0 的追加项会排在末尾；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 追加键 0 这类非分类 ID 的选项后，注意接收表单的一方要能处理该值，避免把 0 当作真实分类 ID 存库。
