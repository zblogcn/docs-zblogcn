---
title: Z-BlogPHP 标签地址自定义接口
description: 通过 Filter_Plugin_Tag_Url 接口在 Z-BlogPHP 读取标签 Url 属性时接管标签地址生成，配合伪静态规则实现自定义标签链接。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Url
  - Tag_Url
  - 标签地址
  - 插件接口
  - 魔术方法
---

# 标签地址自定义接口

在 Z-BlogPHP 中读取标签对象的 `Url` 属性（包括模板中的 `{$tag.Url}`）时会触发 `Filter_Plugin_Tag_Url` 接口，可以接管标签地址的生成逻辑，实现自定义标签链接等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Url` | `&$this` | 干预 Tag 类 Url 方法的接口 |

## 完整案例

下例把全站标签地址统一改为 `tag/{ID}/` 形式，需配合伪静态规则使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Url', 'demoAPP_Tag_Url', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_Tag_Url(&$tag)
{
    global $zbp;

    return $zbp->host . 'tag/' . $tag->ID . '/';
}
```

## 注意事项

- 仅在读取 `Url` 属性时触发；`Url` 是只读虚拟属性，给 `$tag->Url` 赋值不会触发本接口（赋值会被系统忽略）。
- 本例通过 `PLUGIN_EXITSIGNAL_RETURN` 信号无条件使用回调返回值，全站标签地址都会被接管；如只想干预部分标签，可在注册时不设信号，回调内按条件用 `SetPluginSignal` 动态生效。
- `tag/{ID}/` 只是输出的链接形式，必须配合伪静态规则把该形式映射到系统标签列表页，否则前台访问会 404。
- 回调中不要再次读取当前标签的 `Url` 属性，避免递归死循环。
