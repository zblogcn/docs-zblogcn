---
title: Z-BlogPHP 登录失败监听扩展
description: 通过 Filter_Plugin_VerifyLogin_Failed 接口在 Z-BlogPHP 登录验证失败时记录日志并按 IP 限制登录尝试次数的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_VerifyLogin_Failed
  - 插件接口
  - 登录
  - 防暴力破解
---

# 登录失败监听扩展

通过 `Filter_Plugin_VerifyLogin_Failed` 接口，可以在 Z-BlogPHP 的 `VerifyLogin()` 验证失败时执行自定义逻辑，适合记录失败日志、防暴力破解等安全场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_VerifyLogin_Failed` | 无 | VerifyLogin 失败的接口 |

## 完整案例

下例记录失败登录的 IP 与用户名，并对 10 分钟内失败超过 5 次的 IP 直接终止登录流程：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_VerifyLogin_Failed', 'demoAPP_VerifyLogin_Failed');
}

function demoAPP_VerifyLogin_Failed()
{
    global $zbp;

    $ip   = GetGuestIP();
    $name = trim(GetVars('username', 'POST', ''));
    $file = $zbp->usersdir . 'plugin/demoAPP/failed.log';

    // 记录本次失败登录
    $log = date('Y-m-d H:i:s') . ' ' . $name . ' ' . $ip . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND | LOCK_EX);

    // 统计 10 分钟内该 IP 的失败次数，超限则提前终止
    $count = 0;
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines) {
        foreach ($lines as $line) {
            if (strpos($line, $ip) !== false && strtotime(substr($line, 0, 19)) > (time() - 600)) {
                $count++;
            }
        }
    }
    if ($count > 5) {
        Http503();
        exit('登录尝试过于频繁，请 10 分钟后再试。');
    }
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_event.php` 的 `VerifyLogin()` 内，位于验证失败分支、系统默认的 `$zbp->ShowError(8)`（登录失败）之前；
- 接口没有参数，需通过 `GetVars('username', 'POST')`、`GetGuestIP()` 等自行获取本次登录信息；
- 若插件把自身回调的信号置为 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值会直接成为 `VerifyLogin()` 的返回值并跳过默认报错，属于高级用法；
- Z-BlogPHP 的 API 登录失败（`zb_system/api/member.php`）同样触发本接口；
- 本接口无法通过修改参数把失败改为成功，只能做记录、告警或提前终止流程。
