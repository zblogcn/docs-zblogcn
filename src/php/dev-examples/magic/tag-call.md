---
title: Z-BlogPHP 标签虚拟方法接口
description: 通过 Filter_Plugin_Tag_Call 接口在 Z-BlogPHP 调用标签对象不存在的方法时返回自定义虚拟方法，为 Tag 对象扩展可带参数的行为。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Call
  - Tag_Call
  - 虚拟方法
  - 魔术方法
  - 插件接口
---

# 标签虚拟方法接口

在 Z-BlogPHP 中调用标签对象上不存在的方法时（例如 `$tag->GetArticles(10)`），会触发 `Filter_Plugin_Tag_Call` 接口，插件可借此为 Tag 对象扩展「虚拟方法」，让模板和主题代码以对象方法的形式调用插件提供的功能。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Call` | `&$tag, $method, $args` | Tag 类的魔术方法接口 |

## 完整案例

下例为标签对象添加虚拟方法 `GetArticles($num)`，返回该标签下的最新文章列表：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Call', 'demoAPP_Tag_Call');
}

function demoAPP_Tag_Call(&$tag, $method, $args)
{
    if ($method == 'GetArticles') {
        $num = isset($args[0]) ? (int) $args[0] : 10;
        // 动态设置 RETURN 信号，本次调用使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Tag_Call', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return GetList($num, null, null, null, array($tag));
    }
}
```

注册后在模板或代码中直接调用即可：

```php
foreach ($tag->GetArticles(10) as $post) {
    echo $post->Title;
}
```

## 注意事项

- 只在调用对象上真实不存在的方法时触发，`Save()`、`Del()`、`Time()` 等系统已有方法不会走到本接口。
- `$args` 是索引数组，按调用时的参数顺序排列；只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统按默认逻辑处理（通常给出方法不存在的警告）。
- 不要在注册时静态传入 `PLUGIN_EXITSIGNAL_RETURN`，否则所有未知方法的调用都会返回本回调的值，掩盖其他错误。
- 回调中不要调用与 `$method` 同名的虚拟方法本身，避免递归死循环。
