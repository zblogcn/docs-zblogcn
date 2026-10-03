---
title: Z-BlogPHP 指令结束监听扩展
description: 通过 Filter_Plugin_Cmd_End 接口在 Z-BlogPHP 的 cmd.php 动作分发结束后记录操作日志、清理临时数据的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Cmd_End
  - 插件接口
  - cmd.php
  - 流程监听
---

# 指令结束监听扩展

通过 `Filter_Plugin_Cmd_End` 接口，可以在 Z-BlogPHP 的指令入口 `zb_system/cmd.php` 完成全部动作分发之后执行自定义逻辑，适合记录操作日志、清理临时数据等收尾场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Cmd_End` | 无 | cmd.php 的结束接口，可以在这里拦截各种 action 之后的处理 |

## 完整案例

下例在每次 cmd.php 请求处理结束时，把动作名与访客 IP 记入日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Cmd_End', 'demoAPP_Cmd_End');
}

function demoAPP_Cmd_End()
{
    global $zbp;

    $log = date('Y-m-d H:i:s') . ' cmd end, action=' . $zbp->action . ', ip=' . GetGuestIP() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/cmd.log', $log, FILE_APPEND | LOCK_EX);
}
```

## 注意事项

- 触发位置在 `zb_system/cmd.php` 文件末尾，所有 `switch ($zbp->action)` 分发执行完毕之后；
- 核心的跳转函数 `Redirect_cmd_end()` 只发送 302 跳转头而不终止脚本，因此大多数以跳转收尾的动作同样会触发本接口；
- 接口没有参数，需要修改跳转地址应在更早的 `Filter_Plugin_Cmd_Redirect` 接口中处理，而不是本接口；
- 此时请求即将结束，适合做日志、统计等轻量收尾，不宜再输出正文内容。
