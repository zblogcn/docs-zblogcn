---
title: Z-BlogPHP XML-RPC 入口监听接口案例
description: 通过 Filter_Plugin_Xmlrpc_Begin 接口监听 Z-BlogPHP 的 XML-RPC 请求，实现调用审计日志与请求分析。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Xmlrpc_Begin
  - 插件接口
  - XML-RPC
  - 调用审计
---

# XML-RPC 入口监听

`Filter_Plugin_Xmlrpc_Begin` 挂载在 Z-BlogPHP 的 XML-RPC 入口 `zb_system/xml-rpc/index.php` 中。当客户端提交的请求体被 `simplexml_load_string` 成功解析为 XML 对象后、按 `methodName` 分发到具体方法之前触发，插件可以读取本次调用的方法名与参数信息，用于审计日志、请求统计或安全分析。接口于 1.5.1 加入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Xmlrpc_Begin` | `&$xml` | xml-rpc 页的 begin 接口（1.5.1 加入） |

## 完整案例

下例把每次 XML-RPC 调用的方法名、来源 IP 与时间记录到插件日志，形成调用审计记录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Xmlrpc_Begin', 'demoAPP_Xmlrpc_Begin');
}

function demoAPP_Xmlrpc_Begin(&$xml)
{
    global $zbp;
    // $xml 是 SimpleXMLElement 对象，methodName 为本次调用的远程方法名
    $method = (string) $xml->methodName;
    $line = date('Y-m-d H:i:s') . ' ' . $method . ' ' . GetGuestIP() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/xmlrpc.log', $line, FILE_APPEND | LOCK_EX);
}
```

## 注意事项

- 触发位置在 `zb_system/xml-rpc/index.php`：请求体解析成功（`$xml` 为真）后触发；请求体不是合法 XML 时不触发，入口会直接返回 404；
- `$xml` 为 `SimpleXMLElement` 对象，回调中可通过 `$xml->methodName` 读取方法名、遍历 `params` 读取参数；对象本身按引用语义处理，修改节点会影响后续分发读取到的内容，但无法通过它终止调用流程；
- 本接口没有信号与返回值处理机制，回调返回值无效，不能用来拦截或替换 XML-RPC 方法的执行结果；
- XML-RPC 入口此前已把 `Filter_Plugin_Debug_Handler_Common` 注册为 `RespondError`，该流程内的错误会以 XML fault 形式响应，插件回调中抛出的异常同样如此；
- XML-RPC 常被攻击者扫描利用，审计日志应定期轮转，必要时在回调中对高频调用做来源限制提示。
