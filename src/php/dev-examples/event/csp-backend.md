---
title: Z-BlogPHP 后台 CSP 策略监听接口案例
description: 通过 Filter_Plugin_CSP_Backend 接口修改 Z-BlogPHP 后台的 Content-Security-Policy 响应头，放行后台所需的第三方资源域名。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_CSP_Backend
  - 插件接口
  - CSP
  - 后台安全
---

# 后台 CSP 策略监听

`Filter_Plugin_CSP_Backend` 挂载在函数 `GetBackendCSPHeader()` 内部。后台每个管理页在 `admin_header.php` 中都会调用该函数并输出 `Content-Security-Policy` 响应头，本接口允许插件读取并修改默认的 CSP 指令数组，例如为后台编辑器、统计脚本放行第三方资源域名。接口于 1.5.2 加入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_CSP_Backend` | `&$xml` | 后台 CSP 接口（1.5.2 加入） |

## 完整案例

下例在默认策略基础上放行一个第三方脚本域名与图片域名，保证后台引用的 CDN 资源不被 CSP 拦截：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_CSP_Backend', 'demoAPP_CSP_Backend');
}

function demoAPP_CSP_Backend(&$csp)
{
    // $csp 是键为指令名、值为指令内容的数组，必须以引用参数修改才能生效
    $csp['script-src'] .= ' https://cdn.example.com';
    $csp['img-src'] .= ' https://img.example.com';
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_common.php` 的 `GetBackendCSPHeader()` 函数，调用点为 `zb_system/admin/admin_header.php` 输出 `Content-Security-Policy` 头之前，因此后台每个页面都会触发一次；
- 默认策略包含 `default-src 'self' data: blob:`、`img-src * data: blob:`、`media-src * data: blob:`、`script-src 'self' 'unsafe-inline' 'unsafe-eval'`、`style-src 'self' 'unsafe-inline'` 五项指令，最终以「指令 值」用分号拼接输出；
- 接口清单中的参数说明为 `&$xml`，实际传入的是 CSP 数组；回调必须以引用参数（如 `&$csp`）声明，普通值参数的修改不会反映到最终响应头，返回值同样无效；
- 放行来源只应填写确有必要的域名，放宽 `script-src` 等指令会直接降低后台对 XSS 的防护能力，避免使用 `*`；
- 若后台页面出现 CSP 加载拦截报错，可先在浏览器控制台确认被拦截的指令与域名，再通过本接口精确放行。
