---
title: Z-BlogPHP 登录成功监听扩展
description: 通过 Filter_Plugin_VerifyLogin_Succeed 接口在 Z-BlogPHP 登录验证通过后记录登录日志、更新最后登录时间的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_VerifyLogin_Succeed
  - 插件接口
  - 登录
  - 安全日志
---

# 登录成功监听扩展

通过 `Filter_Plugin_VerifyLogin_Succeed` 接口，可以在 Z-BlogPHP 的 `VerifyLogin()` 验证通过后执行自定义逻辑，适合记录登录日志、更新最后登录时间、发送登录通知等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_VerifyLogin_Succeed` | 无 | VerifyLogin 成功的接口 |

## 完整案例

下例在登录成功后记录日志，并把最后登录时间写入用户扩展元数据：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_VerifyLogin_Succeed', 'demoAPP_VerifyLogin_Succeed');
}

function demoAPP_VerifyLogin_Succeed()
{
    global $zbp;

    // 记录登录日志
    $log = date('Y-m-d H:i:s') . ' ' . $zbp->user->Name . ' login, ip=' . GetGuestIP() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/login.log', $log, FILE_APPEND | LOCK_EX);

    // 更新最后登录时间
    $zbp->user->Metas->lastlogintime = time();
    $zbp->user->Save();
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_event.php` 的 `VerifyLogin()` 内，位于用户名密码验证通过、登录 Cookie 已写入（`SetLoginCookie`）之后，此时 `$zbp->user` 与 `$zbp->islogin` 均已就绪；
- 接口没有参数，通过 `global $zbp` 获取当前登录用户，通过 `GetGuestIP()` 获取访客 IP；
- Z-BlogPHP 的 API 登录（`zb_system/api/member.php`）同样会触发本接口，回调中的逻辑对两种登录方式均生效；
- 回调中调用 `$zbp->user->Save()` 会额外执行一次数据库写入，注意控制频率；
- 此时页面尚未输出，本接口不适合用来显示内容，通知类需求建议写日志或异步处理。
