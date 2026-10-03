---
title: Z-BlogPHP GetPost 结果处理接口
description: 通过 Filter_Plugin_GetPost_Result 接口在 Z-BlogPHP 的 GetPost 函数返回文章前就地修改结果，如初始化插件元数据字段。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_GetPost_Result
  - GetPost_Result
  - GetPost
  - 插件接口
  - 数据处理
---

# GetPost 结果处理接口

在 Z-BlogPHP 中，全局函数 `GetPost()` 用于按 ID、标题、别名等条件获取单篇文章对象，它在返回结果之前会触发 `Filter_Plugin_GetPost_Result` 接口，插件可借此对返回的文章对象做统一的就地处理，例如初始化插件用到的 Metas 字段。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_GetPost_Result` | `&$post` | 定义 GetPost 输出结果接口 |

## 完整案例

下例在每次 `GetPost()` 返回文章前，为文章初始化插件使用的浏览量元数据，避免后续读取时字段不存在：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_GetPost_Result', 'demoAPP_GetPost_Result');
}

function demoAPP_GetPost_Result(&$post)
{
    if (!isset($post->Metas->demo_views)) {
        $post->Metas->demo_views = 0;
    }
}
```

## 注意事项

- 每次调用 `GetPost()` 都会触发本接口，包括查询不到结果时返回的空文章对象；回调务必保持轻量，因为文章页、列表页等大量场景都会调用该函数。
- 回调的返回值会被忽略，不能用返回值替换 `GetPost()` 的结果，只能就地修改 `$post` 对象的属性与 Metas。
- `$post` 是对象，回调中的修改会直接反映到 `GetPost()` 的返回值上，但不会自动写入数据库，需要持久化时应显式调用 `Save()`。
- 回调中不要调用 `GetPost()` 本身，避免递归死循环。
