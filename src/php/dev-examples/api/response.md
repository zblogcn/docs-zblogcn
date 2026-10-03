---
title: Z-BlogPHP API 响应内容扩展
description: 通过 Filter_Plugin_API_Response 接口在 Z-BlogPHP 的 API 成功响应数组组装后、编码输出前追加或修改响应内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Response
  - 插件接口
  - API
  - 响应处理
---

# API 响应内容扩展

通过 `Filter_Plugin_API_Response` 接口，可以在 Z-BlogPHP 的 API 成功响应数组组装完成后、JSON 编码输出前追加或修改响应内容，适用于为最终响应补充统一字段、调整输出结构的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Response` | `&$response` | API 响应内容处理，`$response` 为已组装完成的响应数组（含 `code`、`message`、`data`、`error` 等键） |

## 完整案例

下例为所有成功的 API 响应追加版本信息字段：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Response', 'demoAPP_API_Response');
}

function demoAPP_API_Response(&$response)
{
    // $response 已包含 code、message、data、error，调试模式下还有 runtime
    if (is_array($response['data'])) {
        $response['data']['demoapp_api_version'] = '1.0';
    }
}
```

## 注意事项

- 参数 `$response` 需在回调签名中使用引用传递 `&$response`，修改后的数组将被 JSON 编码后输出；
- 该接口在 `ApiResponse()` 中响应数组组装完成、`JsonEncode` 之前触发，且**只在无错误（`$error` 为 null）的成功响应时执行**，错误响应不经过本接口，错误环节应使用 `Filter_Plugin_API_Pre_Response`；
- 与 `Filter_Plugin_API_Pre_Response` 的执行顺序为：先 `Pre_Response`（组装前，修改原始参数），后本接口（组装后，拿到完整数组），两者都会经过时按此先后生效；
- 回调返回值配合 `PLUGIN_EXITSIGNAL_RETURN` 信号可直接替换最终输出的字符串，一般不需要使用；模块走 `raw`、`json` 原始输出路径时不经过本接口。
