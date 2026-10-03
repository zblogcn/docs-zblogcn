---
title: Z-BlogPHP 请求转全局变量监听接口案例
description: Filter_Plugin_Http_Request_Convert_To_Global 接口用于 Z-BlogPHP 在 Swoole 与 Workerman 环境下把请求对象转换为全局变量后执行自定义逻辑。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Http_Request_Convert_To_Global
  - 插件接口
  - Swoole
  - Workerman
---

# 请求转全局变量监听

`Filter_Plugin_Http_Request_Convert_To_Global` 挂载在函数 `http_request_convert_to_global()` 的末尾。该函数的作用是在 Swoole、Workerman 等常驻内存运行环境下，把请求对象携带的数据写入 `$_GET`、`$_POST`、`$_COOKIE`、`$_FILES`、`$_REQUEST`、`$_SERVER` 等全局变量，使 Z-BlogPHP 的标准流程得以按传统方式读取请求数据；本接口允许插件在转换完成后补充或调整全局变量。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Http_Request_Convert_To_Global` | `$request` | http_request_convert_to_global 函数 |

## 完整案例

按源码注释的意图，下例在请求转全局变量完成后，为特殊运行环境补充自定义的 `$_SERVER` 变量供后续流程使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Http_Request_Convert_To_Global', 'demoAPP_Http_Request_Convert_To_Global');
}

function demoAPP_Http_Request_Convert_To_Global($request)
{
    // 仅在常驻内存环境下随 http_request_convert_to_global() 一起被调用
    // $request 为 Workerman 或 Swoole 的请求对象，Workerman 下可能还会附带连接对象
    if (defined('IS_WORKERMAN') && IS_WORKERMAN && isset($_SERVER['HTTP_HOST'])) {
        $_SERVER['HTTP_X_REQUEST_RUNTIME'] = 'workerman';
    } elseif (defined('IS_SWOOLE') && IS_SWOOLE) {
        $_SERVER['HTTP_X_REQUEST_RUNTIME'] = 'swoole';
    }
}
```

## 注意事项

- 核心程序当前未调用此接口（预留接口）：`http_request_convert_to_global()` 函数本身在 Z-BlogPHP 标准运行流程中也没有调用点，仅在以 Swoole、Workerman 等常驻内存方式集成运行时才会生效，本案例按函数的注释意图编写；
- 回调收到的 `$request` 参数即传入 `http_request_convert_to_global()` 的原始请求对象：Workerman 下是 `$request` 对象，且多传的 `$connection` 连接对象等参数会通过 `func_get_args()` 全量透传给回调；
- 该函数执行时会清空并重建 `$_GET`、`$_POST`、`$_COOKIE`、`$_FILES`、`$_REQUEST` 等全局变量，回调中修改这些变量属于最后的补充机会；
- 接口没有信号与返回值处理机制，回调返回值无效，只能通过直接修改全局变量产生效果；
- 在标准 PHP-FPM、Apache 等运行方式下，本接口不会被触发，插件不应将关键业务逻辑绑定在此接口上。
