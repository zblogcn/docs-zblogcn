---
title: Z-BlogPHP API 启动监听扩展
description: 通过 Filter_Plugin_API_Begin 接口在 Z-BlogPHP 的 API 入口启动后执行访问日志、请求统计等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Begin
  - 插件接口
  - API
  - 流程监听
---

# API 启动监听扩展

通过 `Filter_Plugin_API_Begin` 接口，可以在 Z-BlogPHP 的 API 入口（`zb_system/api.php`，即通过 `$zbp->apiurl` 访问的接口地址）启动后执行自定义逻辑，适用于 API 访问日志、请求统计等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Begin` | 无 | API 启动时触发 |

## 完整案例

下例在每次 API 请求开始时，把请求的模块、动作与访客 IP 记录到日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Begin', 'demoAPP_API_Begin');
}

function demoAPP_API_Begin()
{
    global $zbp;
    $mod = GetVars('mod', 'GET', '');
    $act = GetVars('act', 'GET', '');
    $log = date('Y-m-d H:i:s') . ' api ' . $mod . '#' . $act . ' ' . GetGuestIP() . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/api.log';
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数适合做日志、统计等轻量级操作；
- 该接口只在 `zb_system/api.php` 入口触发，此时系统已完成加载并通过了 API 开关检查（`ApiCheckEnable`），尚未进行 API 的登录与权限检查（`ApiCheckAuth`）、黑白名单检查与模块分发；
- 如需在分发阶段按模块、动作做控制，应使用 `Filter_Plugin_API_Dispatch` 接口；
- 写日志等 I/O 操作注意控制频率与文件大小，避免在高请求量下影响性能。
