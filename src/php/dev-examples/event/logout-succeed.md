---
title: Z-BlogPHP 注销成功监听扩展
description: 通过 Filter_Plugin_Logout_Succeed 接口在 Z-BlogPHP 用户注销后记录审计日志、清理临时数据的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Logout_Succeed
  - 插件接口
  - 注销
  - 审计日志
---

# 注销成功监听扩展

通过 `Filter_Plugin_Logout_Succeed` 接口，可以在 Z-BlogPHP 的 `Logout()` 执行完毕后做收尾处理，适合注销审计、清理用户临时数据等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Logout_Succeed` | 无 | Logout 成功的接口 |

## 完整案例

下例在注销后记录审计日志，并清理插件为该用户准备的临时目录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Logout_Succeed', 'demoAPP_Logout_Succeed');
}

function demoAPP_Logout_Succeed()
{
    global $zbp;

    // 记录注销日志
    $log = date('Y-m-d H:i:s') . ' ' . $zbp->user->Name . ' logout, ip=' . GetGuestIP() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/logout.log', $log, FILE_APPEND | LOCK_EX);

    // 清理该用户的临时文件
    $tmp = $zbp->usersdir . 'plugin/demoAPP/tmp/' . $zbp->user->ID . '/';
    if (is_dir($tmp)) {
        foreach ((array) glob($tmp . '*') as $f) {
            @unlink($f);
        }
    }
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_event.php` 的 `Logout()` 内，位于用户名、Token、密码、addinfo 等登录 Cookie 全部清除之后；
- 接口没有参数；此时 `$zbp->user` 对象仍可读取，便于日志记录；
- Z-BlogPHP 的 API 登出流程（`zb_system/api/member.php`）同样触发本接口；
- cmd.php 的 `act=logout` 请求会先经 `CheckIsRefererValid()` 校验来源再执行注销；
- 适合做注销审计与清理，不适合输出页面内容。
