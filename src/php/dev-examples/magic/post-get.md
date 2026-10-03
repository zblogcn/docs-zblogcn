---
title: Z-BlogPHP 文章虚拟属性读取接口
description: 通过 Filter_Plugin_Post_Get 接口在 Z-BlogPHP 读取文章未定义属性时返回自定义虚拟属性，实现动态评分、统计字段等扩展数据。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Get
  - Post_Get
  - 虚拟属性
  - 魔术方法
  - 插件接口
---

# 文章虚拟属性读取接口

在 Z-BlogPHP 中读取文章对象上未被系统定义的属性时（例如模板中访问 `$article->StarLevel`），会触发 `Filter_Plugin_Post_Get` 接口，插件可借此为文章对象扩展只读的虚拟属性，值可以来自 Metas、缓存或实时计算。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Get` | `&$this, $method` | 干预 Post 类 Get 方法的接口 |

## 完整案例

下例为文章对象添加虚拟属性 `StarLevel`（星级评分），数据从文章的 Metas 中读取：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Get', 'demoAPP_Post_Get');
}

function demoAPP_Post_Get(&$post, $name)
{
    if ($name == 'StarLevel') {
        // 动态设置 RETURN 信号，本次读取使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Post_Get', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return isset($post->Metas->demo_star) ? (int) $post->Metas->demo_star : 0;
    }
}
```

注册后在模板或代码中直接读取即可：

```php
echo $article->StarLevel;
```

## 注意事项

- 只在读取系统内部未处理的属性名时触发：`Url`、`Author`、`Category`、`Tags`、`Prev`、`Next` 等内置虚拟属性各有专门的处理分支，`Title`、`Content` 等普通字段直接从数据中返回，都不会走到本接口。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统继续按默认逻辑处理该属性。
- 不要在注册时静态传入 `PLUGIN_EXITSIGNAL_RETURN`，否则所有未定义属性的读取都会返回本回调的值，影响其他属性的正常读取。
- 回调中不要读取与 `$name` 同名的属性，避免递归死循环。
