---
title: Z-BlogPHP 错误异常对象接管接口案例
description: 通过 Filter_Plugin_Debug_Handler_ZEE 接口在 Z-BlogPHP 中接管 ZbpErrorException 错误对象，实现错误上报与自定义异常处理。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Debug_Handler_ZEE
  - 插件接口
  - 错误处理
  - 异常上报
---

# 错误异常对象接管

`Filter_Plugin_Debug_Handler_ZEE` 接口在 Z-BlogPHP 的调试处理器把运行时错误、未捕获异常或当机信息统一解析为 `ZbpErrorException` 对象之后触发，插件可以拿到结构化的错误对象做自定义处理，例如错误上报、聚合分析或替换默认的错误展示，是 1.7.3 之后官方推荐使用的调试接管接口之一。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Debug_Handler_ZEE` | `$zee, $debug_type` | 定义 Debug_Exception_Handler、Debug_Error_Handler 函数的接口 |

## 完整案例

下例在每次错误发生时把错误概要写入插件日志文件并声明接管，接管后系统不再继续执行 `Debug_Handler_Common` 与默认的错误页面渲染：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Debug_Handler_ZEE', 'demoAPP_Debug_Handler_ZEE');
}

function demoAPP_Debug_Handler_ZEE($zee, $debug_type)
{
    global $zbp;
    // $zee 是 ZbpErrorException 对象，$debug_type 取值为 Error、Exception 或 Fatal
    $message = date('Y-m-d H:i:s') . ' [' . $debug_type . '] ' . $zee->getMessage()
        . ' ' . $zee->getFile() . ':' . $zee->getLine() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/error-report.log', $message, FILE_APPEND);

    // 在回调内把自己的信号声明为 RETURN，接管本次错误处理
    $GLOBALS['hooks']['Filter_Plugin_Debug_Handler_ZEE']['demoAPP_Debug_Handler_ZEE'] = PLUGIN_EXITSIGNAL_RETURN;
    return true;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_debug.php`：`Debug_Error_Handler`（`$debug_type` 为 `Error`）、`Debug_Exception_Handler`（`Exception`）、`Debug_Shutdown_Handler`（`Fatal`，已标注不再使用）三处；
- 该接口在执行循环中会先把每个回调的信号重置为 `PLUGIN_EXITSIGNAL_NONE` 再调用回调，因此注册时的退出信号参数不生效，必须在回调内部通过 `$GLOBALS['hooks']` 数组声明 `PLUGIN_EXITSIGNAL_RETURN` 才能接管，系统 API 模块的 `ApiDebugHandler` 即采用此写法；
- 接管（返回 `true` 且信号为 `PLUGIN_EXITSIGNAL_RETURN`）后，`Filter_Plugin_Debug_Handler_Common`、`Filter_Plugin_Debug_Display` 及默认的 `$zec->Display()` 都不会再执行，插件需自行完成错误信息的输出或静默处理；
- 运行时错误还需通过 `error_reporting` 与 `Debug_IgnoreError` 的过滤才会走到本接口，`@` 抑制的错误不会触发；
- 回调发生在错误处理关键路径上，逻辑应尽量轻量，避免在本接口中再抛出异常造成循环。
