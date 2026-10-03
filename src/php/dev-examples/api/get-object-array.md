---
title: Z-BlogPHP API 对象输出扩展
description: 通过 Filter_Plugin_API_Get_Object_Array 接口在 Z-BlogPHP 的 API 对象转换为数组时增删输出字段、保护敏感数据的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Get_Object_Array
  - 插件接口
  - API
  - 数据输出
---

# API 对象输出扩展

通过 `Filter_Plugin_API_Get_Object_Array` 接口，可以在 Z-BlogPHP 的 API 把对象转换为数组输出时（`ApiGetObjectArray()`）追加或删除字段，适用于控制 API 输出内容、隐藏敏感字段、补充自定义数据等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Get_Object_Array` | `&$object, &$array, &$other_props, &$remove_props, &$with_relations` | API 转换 Object 到 Array，`$array` 为对象数据数组，另四个参数分别控制追加属性、删除属性与关联对象 |

## 完整案例

下例在文章输出中删除摘要字段，并追加一个自定义属性：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Get_Object_Array', 'demoAPP_API_Get_Object_Array');
}

function demoAPP_API_Get_Object_Array(&$object, &$array, &$other_props, &$remove_props, &$with_relations)
{
    // 仅处理文章对象
    if (get_class($object) == 'Post' && $object->Type == ZC_POST_TYPE_ARTICLE) {
        // 从输出数组中移除摘要
        $remove_props[] = 'Intro';
        // 追加自定义属性（属性名会取对象同名成员的值）
        $array['demoapp_source'] = $object->Metas->demoapp_source;
    }
}
```

## 注意事项

- 参数需在回调签名中使用引用传递（`&$object, &$array` 等）才能生效；该接口对每个被转换的对象各触发一次，对象列表会逐个调用，用户、文章、评论等对象的 API 输出都会经过这里；
- 回调触发时 `$array` 已生成（`GetData()` 结果并已移除 `Meta`），但 `$other_props`（追加属性）、`$remove_props`（删除属性）、`$with_relations`（关联对象）的处理在本接口**之后**执行，因此向 `$other_props`、`$remove_props` 追加值同样有效；
- 系统对 `Member` 对象会强制移除 `Guid`、`Password`、`IP` 三个字段，插件不应也无法通过本接口把它们加回来；
- 修改 `$with_relations` 可控制输出的关联对象（如 `Category`、`Author`、`Tags`），但各模块通常先用请求参数 `with_relations` 过滤过关联清单，直接修改不一定对所有端点生效。
