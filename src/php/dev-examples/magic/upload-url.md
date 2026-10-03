---
title: Z-BlogPHP 附件地址自定义扩展
description: 通过 Filter_Plugin_Upload_Url 接口替换 Z-BlogPHP 附件访问地址，接入 CDN 加速域名等自定义地址规则的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_Url
  - 插件接口
  - 附件
  - Url
  - CDN
---

# 附件地址自定义扩展

通过 `Filter_Plugin_Upload_Url` 接口，可以在 Z-BlogPHP 读取附件对象的 `Url` 属性（访问地址）时接管默认逻辑，适用于接入 CDN 加速域名、对象存储直链等场景。模板输出、缩略图生成等读取 `$upload->Url` 的地方都会触发本接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_Url` | `$upload` | Upload 类的 Url 方法接口 |

## 完整案例

下例把附件访问地址替换为 CDN 域名下的对应路径：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_Url', 'demoAPP_Upload_Url');
}

function demoAPP_Upload_Url($upload)
{
    global $zbp;
    // 返回非空值即作为附件地址，返回空值则交回系统默认地址
    return 'https://cdn.example.com/zb_users/' . $upload->Dir . rawurlencode($upload->Name);
}
```

## 注意事项

- 本接口的返回值非空即生效，不需要设置 `PLUGIN_EXITSIGNAL_RETURN` 信号；返回空值或 null 时交回系统默认地址（`$zbp->host . 'zb_users/' . $upload->Dir . rawurlencode($upload->Name)`）；
- 自 Z-BlogPHP 1.7.3 起，接口返回空值会交回下一棒处理直至系统默认值；之前的版本没有空值判断，回调一旦注册就必须返回完整地址；
- 本接口影响的是运行时通过 `$upload->Url` 输出的地址，文章正文中已写死的旧地址不会被自动替换，启用 CDN 后需要另行处理历史内容；
- 新地址必须真实可访问，CDN 方案需正确配置回源，否则全站附件都会 404。
