---
title: Z-BlogPHP 指令跳转监听扩展
description: 通过 Filter_Plugin_Cmd_Redirect 接口在 Z-BlogPHP 的 cmd.php 最终跳转前记录审计日志并修改跳转地址的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Cmd_Redirect
  - 插件接口
  - 跳转
  - 审计日志
---

# 指令跳转监听扩展

通过 `Filter_Plugin_Cmd_Redirect` 接口，可以在 Z-BlogPHP 的指令入口 `zb_system/cmd.php` 发出最终 302 跳转之前介入，用于修改跳转地址或记录操作审计日志。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Cmd_Redirect` | `$url, $action` | cmd.php 的最后跳转接口，用于修改 url 跳转值 |

## 完整案例

下例记录每次指令跳转的审计日志，并把退出登录后的跳转目标改为站点首页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Cmd_Redirect', 'demoAPP_Cmd_Redirect');
}

function demoAPP_Cmd_Redirect(&$url, $action)
{
    global $zbp;

    // 记录一条操作审计日志
    $name = $zbp->user->ID ? $zbp->user->Name : 'guest';
    $log = date('Y-m-d H:i:s') . ' ' . $name . ' action=' . $action . ' redirect=' . $url . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/redirect.log', $log, FILE_APPEND | LOCK_EX);

    // 示例：退出登录后跳转到站点首页
    if ($action == 'logout') {
        $url = $zbp->host;
    }
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_event.php` 的 `Redirect_cmd_end()` 与 `Redirect_cmd_end_by_script()` 内，cmd.php 中绝大多数动作的最后跳转都会经过它们；
- 参数为 `$url, $action`；`$url` 必须按引用声明（`&$url`）才能修改最终跳转地址，`$action` 为当前执行的动作名；
- 修改 `$url` 后系统随即发送 302 头，多个插件同时修改时按注册顺序依次生效，注意避免互相覆盖；
- 跳转头发出后脚本并不会立即结束，随后仍会触发 `Filter_Plugin_Cmd_End` 接口。
