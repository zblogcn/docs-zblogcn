---
title: Z-BlogPHP ShowError 错误接管接口案例
description: 通过 Filter_Plugin_Debug_Handler_Common 接口在 Z-BlogPHP 中接管 ShowError 错误输出，实现 JSON 错误响应与错误记录。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Debug_Handler_Common
  - 插件接口
  - ShowError
  - 错误处理
---

# ShowError 错误接管

`Filter_Plugin_Debug_Handler_Common` 是 1.7.3 用以替代 `Filter_Plugin_Zbp_ShowError` 的新接口，插件无须改动旧回调的参数即可迁移。当 Z-BlogPHP 发生调试错误、未捕获异常，或代码调用 `$zbp->ShowError()` 抛出的异常进入系统调试处理器时触发，适合按错误码输出自定义格式的错误响应，例如前端需要的 JSON 错误。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Debug_Handler_Common` | `int $errno, string $errstr, string $errfile, int $errline` | 这是 `Filter_Plugin_Zbp_ShowError` 接口的替代品，无须改动插件函数的参数 |

## 完整案例

下例接管错误输出：记录错误后以 JSON 形式响应，声明接管后系统默认的错误页面不再渲染：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Debug_Handler_Common', 'demoAPP_Debug_Handler_Common');
}

function demoAPP_Debug_Handler_Common($errno, $errstr, $errfile, $errline)
{
    // 实际调用时还会传入 $moreinfo（附加信息数组）与 $httpcode（HTTP 状态码）
    // 记录错误到插件日志
    global $zbp;
    $line = date('Y-m-d H:i:s') . ' [' . $errno . '] ' . $errstr . ' ' . $errfile . ':' . $errline . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/showerror.log', $line, FILE_APPEND);

    // 以 JSON 输出错误并声明接管
    $GLOBALS['hooks']['Filter_Plugin_Debug_Handler_Common']['demoAPP_Debug_Handler_Common'] = PLUGIN_EXITSIGNAL_RETURN;
    ob_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array('code' => $errno, 'message' => $errstr), JSON_UNESCAPED_UNICODE);
    exit;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_debug.php` 的 `Debug_Error_Handler`、`Debug_Exception_Handler`、`Debug_Shutdown_Handler` 三处，回调实际收到 6 个参数：错误码、错误信息、文件、行号、`$moreinfo` 数组与 HTTP 状态码，多出的参数在旧回调中可省略；
- 核心自身即依赖该接口切换错误响应格式：`admin/updatedb.php` 与评论提交（`cmd.php`）用 `JsonError4ShowErrorHook` 输出 JSON，XML-RPC 入口用 `RespondError` 输出 XML fault，插件注册的回调会与之并存；
- 与 `Filter_Plugin_Debug_Handler_ZEE` 相同，循环会先重置信号再调用回调，接管需在回调内部把 `$GLOBALS['hooks']` 中自己的信号声明为 `PLUGIN_EXITSIGNAL_RETURN`；
- 声明接管后，后续 `Debug_Handler_ZEE` 同级链路不会继续（先 ZEE 后 Common），默认错误展示也不会执行，回调应负责输出内容并以 `exit` 结束；
- `$zbp->ShowError()` 的错误码为数字时，信息取自语言包 `$zbp->lang['error']`，HTTP 状态码默认 500，`ShowError(2)` 时为 404，插件可根据错误码分支处理。
