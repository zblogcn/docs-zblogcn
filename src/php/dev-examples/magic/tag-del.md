---
title: Z-BlogPHP 标签删除联动接口
description: 通过 Filter_Plugin_Tag_Del 接口在 Z-BlogPHP 标签删除时执行联动清理，如删除插件缓存文件、统计记录，或按需拦截删除操作。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Del
  - Tag_Del
  - 标签删除
  - 插件接口
  - 魔术方法
---

# 标签删除联动接口

在 Z-BlogPHP 中调用标签对象的 `Del()` 方法时会先触发 `Filter_Plugin_Tag_Del` 接口，插件可借此同步清理与标签关联的数据，例如插件自己生成的缓存文件、配置记录等。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Del` | `&$tag` | Tag 类的 Del 方法接口 |

## 完整案例

下例在删除标签时，同步删除插件为该标签生成的缓存文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Del', 'demoAPP_Tag_Del');
}

function demoAPP_Tag_Del(&$tag)
{
    global $zbp;

    $file = $zbp->cachedir . 'demoAPP/tag-' . $tag->ID . '.cache';
    if (is_readable($file)) {
        unlink($file);
    }
}
```

## 注意事项

- 触发时机在数据从数据库删除之前：默认注册方式下回调返回值被忽略，删除动作照常执行。
- 若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值将直接作为 `Del()` 的返回值并跳过数据库删除，可实现删除拦截，但需自行处理提示与后续逻辑。
- 删除标签不影响文章中保存的标签串（`log_Tag` 字段），如需联动清理文章上的标签引用，应在这里自行遍历处理。
- 回调中不要再次对当前对象调用 `Del()`，避免递归。
