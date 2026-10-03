---
title: Z-BlogPHP 文章地址自定义接口
description: 通过 Filter_Plugin_Post_Url 接口在 Z-BlogPHP 读取文章 Url 属性时接管地址生成，实现自定义文章链接、静态化地址等功能的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Url
  - Post_Url
  - 自定义文章地址
  - 插件接口
  - 魔术方法
---

# 文章地址自定义接口

在 Z-BlogPHP 中，文章对象的 `Url` 是一个虚拟属性，每次读取 `$post->Url`（包括模板中的 `{$article.Url}`）时都会触发 `Filter_Plugin_Post_Url` 接口，可以借此接管文章地址的生成逻辑，实现自定义链接、站外跳转地址等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Url` | `&$this` | 干预 Post 类 Url 方法的接口 |

## 完整案例

下例只为设置了 `demo_custom_url` 元数据（Metas）的文章返回自定义地址，其余文章仍走系统默认的路由规则生成地址：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Url', 'demoAPP_Post_Url');
}

function demoAPP_Post_Url(&$post)
{
    global $zbp;

    $custom = isset($post->Metas->demo_custom_url) ? $post->Metas->demo_custom_url : '';
    if ($custom != '') {
        // 动态设置 RETURN 信号，本次读取 Url 时使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Post_Url', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return $zbp->host . 'goto/?url=' . rawurlencode($custom);
    }
}
```

## 注意事项

- 仅在读取 `Url` 属性时触发；`Url` 是只读虚拟属性，直接给 `$post->Url` 赋值不会触发本接口（赋值会被系统忽略）。
- 注册时第三个参数传 `PLUGIN_EXITSIGNAL_RETURN` 表示无条件使用回调返回值，所有文章的 Url 都会被接管；本例使用 `SetPluginSignal` 按需生效，未设置自定义地址的文章继续由系统按路由规则生成地址。
- 回调中不要再次读取当前文章的 `Url` 属性（例如拼接列表），否则会再次触发本接口造成死循环。
- 返回的自定义地址需要配合伪静态规则或自行保证可访问，否则前台点击会得到 404。
