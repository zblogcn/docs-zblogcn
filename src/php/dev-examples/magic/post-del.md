---
title: Z-BlogPHP 文章删除联动接口
description: 通过 Filter_Plugin_Post_Del 接口在 Z-BlogPHP 文章删除时执行联动清理，如删除插件缓存文件、统计数据，或按需拦截删除操作。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Del
  - Post_Del
  - 文章删除
  - 插件接口
  - 魔术方法
---

# 文章删除联动接口

在 Z-BlogPHP 中调用文章对象的 `Del()` 方法时会先触发 `Filter_Plugin_Post_Del` 接口，插件可借此同步清理与文章关联的数据，例如插件自己生成的缓存文件、统计记录等。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Del` | `&$post` | Post 类的 Del 方法接口 |

## 完整案例

下例在删除文章时，同步删除插件为该文章生成的缩略图缓存文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Del', 'demoAPP_Post_Del');
}

function demoAPP_Post_Del(&$post)
{
    global $zbp;

    $file = $zbp->cachedir . 'demoAPP/thumb-' . $post->ID . '.jpg';
    if (is_readable($file)) {
        unlink($file);
    }
}
```

## 注意事项

- 触发时机在数据从数据库删除之前：默认注册方式下回调返回值被忽略，删除动作照常执行。
- 若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值将直接作为 `Del()` 的返回值并跳过数据库删除，可实现「软删除」或删除拦截，但被拦截的文章仍会留在列表中，需自行处理提示。
- 回调收到的 `$post` 对象数据完整，可放心使用 `$post->ID`、`$post->Metas` 等信息做清理。
- 不要在回调中再次对当前对象调用 `Del()`，避免递归。
