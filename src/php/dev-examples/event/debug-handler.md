---
title: Z-BlogPHP 已废弃错误处理接口监听案例
description: Filter_Plugin_Debug_Handler 是 Z-BlogPHP 已废弃的错误处理监听接口，本文给出兼容旧插件的监听案例与迁移到新接口的建议。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Debug_Handler
  - 插件接口
  - 错误处理
  - 流程监听
---

# 已废弃错误处理接口监听

`Filter_Plugin_Debug_Handler` 是 Z-BlogPHP 早期版本提供错误处理监听接口，1.7.3 起已废弃。当 PHP 运行时错误（`Debug_Error_Handler`）、未捕获异常（`Debug_Exception_Handler`）或脚本当机（`Debug_Shutdown_Handler`，已标注不再使用）进入系统调试处理器时，会在处理链的最开头遍历该接口并通知所有注册的回调，适合做纯监听记录，无法接管处理流程。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Debug_Handler` | 无 | 1.7.3 已废弃，不应再使用 |

## 完整案例

下例演示旧插件风格的兼容性监听：把错误类型与概要信息追加到插件自己的日志文件中：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Debug_Handler', 'demoAPP_Debug_Handler');
}

function demoAPP_Debug_Handler($type, $error)
{
    global $zbp;
    // $type 取值为 Error、Exception 或 Shutdown
    // $error 在 Error 时是 array(级别, 信息, 文件, 行号)，Exception 时是异常对象
    $detail = ($type === 'Exception' && is_object($error)) ? $error->getMessage() : var_export($error, true);
    $line = date('Y-m-d H:i:s') . ' ' . $type . ' ' . $detail . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/debug-legacy.log', $line, FILE_APPEND);
}
```

## 注意事项

- 该接口已在 1.7.3 废弃，新插件不应使用，本文案例仅供维护旧插件时参考；
- 核心对它的调用位于 `zb_system/function/c_system_debug.php` 三个调试处理函数的开头，仅作通知，回调返回值不会被执行器检查，无法中断或接管错误处理流程；
- 需要接管错误输出时，应迁移到 `Filter_Plugin_Debug_Handler_Common` 或 `Filter_Plugin_Debug_Handler_ZEE` 接口，参数语义见对应文档；
- `Debug_Shutdown_Handler`（`Shutdown` 类型）在源码中已标注「不再使用」，不要依赖该类型回调；
- 该接口在错误抑制符 `@` 命中、`E_DEPRECATED` 等场景下不会触发，不能当作全量错误日志的唯一来源。
