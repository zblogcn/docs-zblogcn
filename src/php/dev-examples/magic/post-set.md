---
title: Z-BlogPHP 文章属性写入监听接口
description: 通过 Filter_Plugin_Post_Set 接口在 Z-BlogPHP 监听文章对象每一次属性写入，实现内容联动处理、修改日志、数据同步等功能的插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Set
  - Post_Set
  - 属性写入
  - 魔术方法
  - 插件接口
---

# 文章属性写入监听接口

在 Z-BlogPHP 中给文章对象写入属性（例如 `$post->Content = '...'`）时会触发 `Filter_Plugin_Post_Set` 接口，可用于监听字段变化、做联动处理（如同步生成摘要、记录修改日志）等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Set` | `&$this, $method, $arg` | 干预 Post 类 Set 方法的接口 |

## 完整案例

下例在每次写入文章 `Content` 时，把过滤后的纯文本同步存入 Metas，供插件后续使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Set', 'demoAPP_Post_Set');
}

function demoAPP_Post_Set(&$post, $name, $value)
{
    if ($name == 'Content') {
        // 联动处理：把纯文本内容缓存到 Metas
        $post->Metas->demo_plain_text = trim(strip_tags($value));
    }
}
```

## 注意事项

- 文章对象的每一次属性写入都会触发本接口（包括 `Title`、`Content` 等普通字段的常规赋值），但 `Url`、`Author`、`Category`、`Prev`、`Next`、`TopType` 等系统虚拟属性被专门拦截，写入这些属性不会触发。
- 回调发生在数据真正写入对象之前：回调执行完毕后，系统才把原始的 `$value` 存入对象数据。
- 回调的返回值会被忽略，无法通过返回值取消或替换本次写入；如确需修改要写入的值，可将第三参数声明为引用传递（`&$value`），修改后会以修改后的值入库，但请谨慎使用。
- 回调中给当前文章对象再赋值其他属性会再次触发本接口，注意条件收敛，避免死循环。
