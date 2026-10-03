---
title: Z-BlogPHP 指令开始监听扩展
description: 通过 Filter_Plugin_Cmd_Begin 接口在 Z-BlogPHP 的 cmd.php 动作分发前按 act 做访问控制、维护时段限制等自定义处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Cmd_Begin
  - 插件接口
  - cmd.php
  - 访问控制
---

# 指令开始监听扩展

通过 `Filter_Plugin_Cmd_Begin` 接口，可以在 Z-BlogPHP 的指令入口 `zb_system/cmd.php` 完成系统加载与权限检查之后、动作分发之前执行自定义逻辑，适合按 `act` 做访问控制、维护时段限制等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Cmd_Begin` | 无 | cmd.php 的启动接口，可以在这里拦截各种 action |

## 完整案例

下例在凌晨维护时段只允许管理员执行任何动作，并把搜索动作限制为登录用户可用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Cmd_Begin', 'demoAPP_Cmd_Begin');
}

function demoAPP_Cmd_Begin()
{
    global $zbp;

    // 维护时段（凌晨 3-5 点）仅允许管理员提交动作
    $hour = (int) date('G');
    if ($hour >= 3 && $hour < 5 && !$zbp->CheckRights('admin')) {
        $zbp->ShowError(6, __FILE__, __LINE__);
    }

    // 搜索动作仅对登录用户开放，防止被脚本批量抓取
    if ($zbp->action == 'search' && !$zbp->user->ID) {
        $zbp->ShowError(6, __FILE__, __LINE__);
    }
}
```

## 注意事项

- 触发位置在 `zb_system/cmd.php` 中，此时 `$zbp->Load()` 已执行完毕、`$zbp->CheckRights($zbp->action)` 的基础权限检查已通过，尚未进入 `switch ($zbp->action)` 的动作分发；
- 接口没有参数，可通过 `$zbp->action`（或 `GetVars('act', 'GET')`）获取当前动作名；
- 此刻用户、配置、模板等系统功能已就绪，需要终止请求时可在回调中调用 `$zbp->ShowError()` 或自行跳转；
- 前台登录、发表评论、后台操作等所有经过 cmd.php 的请求都会触发本接口，回调逻辑务必保持轻量。
