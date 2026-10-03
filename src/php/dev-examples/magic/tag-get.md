---
title: Z-BlogPHP 标签虚拟属性读取接口
description: 通过 Filter_Plugin_Tag_Get 接口在 Z-BlogPHP 读取标签未定义属性时返回自定义虚拟属性，如 SEO 标题、扩展配置等场景。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Get
  - Tag_Get
  - 虚拟属性
  - 魔术方法
  - 插件接口
---

# 标签虚拟属性读取接口

在 Z-BlogPHP 中读取标签对象上未被系统定义的属性时（例如模板中访问 `$tag->SeoTitle`），会触发 `Filter_Plugin_Tag_Get` 接口，插件可借此为标签对象扩展只读的虚拟属性。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Get` | `&$this, $method` | 干预 Tag 类 Get 方法的接口 |

## 完整案例

下例为标签对象添加虚拟属性 `SeoTitle`，优先读取 Metas 中保存的 SEO 标题，未设置时回退为标签名：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Get', 'demoAPP_Tag_Get');
}

function demoAPP_Tag_Get(&$tag, $name)
{
    if ($name == 'SeoTitle') {
        // 动态设置 RETURN 信号，本次读取使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Tag_Get', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        $seo = isset($tag->Metas->demo_seo_title) ? $tag->Metas->demo_seo_title : '';
        return $seo != '' ? $seo : $tag->Name;
    }
}
```

## 注意事项

- 只在读取系统内部未处理的属性名时触发：`Url`、`Template`、`AliasFirst` 等内置虚拟属性各有专门的处理分支，`Name`、`Alias` 等普通字段直接从数据中返回，都不会走到本接口。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统继续按默认逻辑处理该属性。
- 不要在注册时静态传入 `PLUGIN_EXITSIGNAL_RETURN`，否则所有未定义属性的读取都会返回本回调的值，影响其他属性的正常读取。
- 回调中不要读取与 `$name` 同名的属性，避免递归死循环。
