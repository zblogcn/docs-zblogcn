---
title: Z-BlogPHP 分类删除联动接口
description: 通过 Filter_Plugin_Category_Del 接口在 Z-BlogPHP 分类删除时执行联动清理，如删除插件缓存文件、统计记录，或按需拦截删除操作。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Category_Del
  - Category_Del
  - 分类删除
  - 插件接口
  - 魔术方法
---

# 分类删除联动接口

在 Z-BlogPHP 中调用分类对象的 `Del()` 方法时会先触发 `Filter_Plugin_Category_Del` 接口，插件可借此同步清理与分类关联的数据，例如插件自己生成的缓存文件、配置记录等。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Category_Del` | `&$category` | Category 类的 Del 方法接口 |

## 完整案例

下例在删除分类时，同步删除插件为该分类生成的缓存文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Category_Del', 'demoAPP_Category_Del');
}

function demoAPP_Category_Del(&$category)
{
    global $zbp;

    $file = $zbp->cachedir . 'demoAPP/cate-' . $category->ID . '.cache';
    if (is_readable($file)) {
        unlink($file);
    }
}
```

## 注意事项

- 触发时机在数据从数据库删除之前：默认注册方式下回调返回值被忽略，删除动作照常执行。
- 若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值将直接作为 `Del()` 的返回值并跳过数据库删除，可实现删除拦截，但需自行处理提示与后续逻辑。
- 删除分类不影响分类下的文章，文章的 `CateID` 仍在；如需联动处理文章，应在这里自行遍历处理。
- 回调中不要再次对当前对象调用 `Del()`，避免递归。
