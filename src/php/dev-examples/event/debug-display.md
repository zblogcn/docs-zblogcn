---
title: Z-BlogPHP 错误页面展示接管接口案例
description: 通过 Filter_Plugin_Debug_Display 接口接管 Z-BlogPHP 的默认错误页面渲染，实现自定义错误页面与维护提示页。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Debug_Display
  - 插件接口
  - 错误页面
  - 异常处理
---

# 错误页面展示接管

`Filter_Plugin_Debug_Display` 接口在 Z-BlogPHP 调试处理链的最后一步触发：当运行时错误、未捕获异常没有被 `Debug_Handler_ZEE`、`Debug_Handler_Common` 两级接口接管时，系统会先调用本接口的所有回调，若仍无人接管则执行默认的 `$zec->Display()` 渲染标准错误页。插件可用它把错误页面替换为自定义的 HTML 页面。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Debug_Display` | `$zec` | 定义 ZBlogException 的 Display 函数的接口（与 Handler 不同的是一个传入 zbp 异常类一个是控制类） |

## 完整案例

下例把默认错误页替换为自定义的简单 HTML 错误页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Debug_Display', 'demoAPP_Debug_Display');
}

function demoAPP_Debug_Display($zec)
{
    // $zec 是 ZbpErrorControl 控制类对象，默认流程将调用 $zec->Display() 渲染错误页
    // 在回调内声明接管并输出自定义错误页面
    $GLOBALS['hooks']['Filter_Plugin_Debug_Display']['demoAPP_Debug_Display'] = PLUGIN_EXITSIGNAL_RETURN;

    http_response_code(500);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>站点出错了</title></head>';
    echo '<body><h1>站点暂时无法访问</h1><p>服务器开小差了，请稍后刷新重试。</p></body></html>';
    exit;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_debug.php`：`Debug_Error_Handler`、`Debug_Exception_Handler`、`Debug_Shutdown_Handler`（已标注不再使用）在 `Debug_Handler_ZEE` 与 `Debug_Handler_Common` 均未接管后转入本接口；
- 参数 `$zec` 是 `ZbpErrorControl` 控制类对象，与 `Filter_Plugin_Debug_Handler_ZEE` 收到的 `ZbpErrorException` 异常类对象不同，前者负责展示控制，后者承载错误信息；
- 接管方式与 Handler 系列一致：循环先重置信号，回调内需通过 `$GLOBALS['hooks']` 数组把自己的信号声明为 `PLUGIN_EXITSIGNAL_RETURN`，此后默认的 `$zec->Display()` 不会执行；
- 接管后插件必须自行输出完整的页面内容并结束脚本，否则访客会看到空白页；若只想附加内容而不替换页面，请不要声明接管；
- 该接口作用于全站所有错误场景（前台、后台、API 等），输出前建议判断执行环境，避免在 XML-RPC、API 等非 HTML 上下文中输出网页内容。
