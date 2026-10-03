---
title: Z-BlogPHP 系统日志监听接口案例
description: 通过 Filter_Plugin_Logs 接口监听 Z-BlogPHP 的 Logs 日志函数，实现日志转发、外部收集与自定义落盘策略。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Logs
  - 插件接口
  - 日志
  - 运行监控
---

# 系统日志监听

`Filter_Plugin_Logs` 接口挂载在 Z-BlogPHP 的日志函数 `Logs()` 内部。系统内部凡需要记录运行日志的地方（调试错误、异常、当机信息等）都会调用该函数，函数在组织好日志内容、级别、来源、时间与附加信息后，先把它们交给本接口的所有回调，若无回调接管则把日志写入 `$zbp->logsdir` 下的默认日志文件。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Logs` | `$s, $iserror` | 监控记录函数 |

## 完整案例

下例把系统日志以 JSON 行的格式转发到插件自己的日志文件，并声明接管以避免系统重复写默认日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Logs', 'demoAPP_Logs', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_Logs($logString, $level, $source, $time, $addinfo)
{
    // 实际参数为 5 个：日志内容、级别（INFO/ERROR/EXCEPTION 等）、来源、时间字符串、附加信息数组
    $record = json_encode(array(
        'time'    => $time,
        'level'   => $level,
        'source'  => $source,
        'message' => $logString,
    ), JSON_UNESCAPED_UNICODE) . PHP_EOL;
    file_put_contents(dirname(__FILE__) . '/demoapp.log', $record, FILE_APPEND | LOCK_EX);

    // 返回值将作为 Logs() 的返回值，接管后系统不再写默认日志文件
    return true;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_common.php` 的 `Logs` 函数内部；接口清单中的 `$s, $iserror` 为旧版参数说明，当前版本回调实际收到 5 个参数：`$logString`（日志内容）、`$level`（INFO、DEBUG、TRACE、NOTICE、WARN、ALERT、ERROR、EXCEPTION、FATAL 等级别字符串）、`$source`（system 或插件 ID）、`$time`（含毫秒与市区偏移的时间字符串）、`$addinfo`（含 IP、URI、请求头、debug_backtrace 等的数组）；
- 旧调用习惯传 `true` 或 `false` 作为级别时会被分别转换为 `ERROR` 与 `INFO`，回调内应按字符串级别处理；
- 本接口的执行循环没有重置信号，注册时把退出信号设为 `PLUGIN_EXITSIGNAL_RETURN` 后，回调返回值直接成为 `Logs()` 的返回值，系统默认的日志文件（`$zbp->logsdir` 下按站点 GUID 或路径 MD5 命名的按日文件）不再写入；
- `$addinfo` 中包含完整的请求头与 `debug_backtrace`，转发到外部服务前应注意脱敏，避免泄露 Cookie 等敏感信息；
- 错误处理流程中也会调用 `Logs()`，回调逻辑应尽量轻量且不得再触发日志或异常，防止形成循环。
