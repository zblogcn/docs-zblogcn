---
title: Z-BlogPHP API 响应预处理扩展
description: 通过 Filter_Plugin_API_Pre_Response 接口在 Z-BlogPHP 的 API 响应数组组装前统一修改数据、状态码与消息的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Pre_Response
  - 插件接口
  - API
  - 响应处理
---

# API 响应预处理扩展

通过 `Filter_Plugin_API_Pre_Response` 接口，可以在 Z-BlogPHP 的 API 响应函数（`ApiResponse`）组装响应数组之前，对数据、错误、状态码与消息做统一修改，适用于为所有响应追加公共数据、调整错误提示等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Pre_Response` | `&$data, &$error, &$code, &$message` | API 响应处理前接口，`$data` 为响应数据，`$error` 为错误对象，`$code` 为状态码，`$message` 为消息 |

## 完整案例

下例为所有成功响应的数据追加站点标识，并在出错时统一改写对外消息：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Pre_Response', 'demoAPP_API_Pre_Response');
}

function demoAPP_API_Pre_Response(&$data, &$error, &$code, &$message)
{
    if ($error === null) {
        // 成功响应：追加公共字段
        if (is_array($data)) {
            $data['demoapp_site'] = 'demo';
        }
    } else {
        // 出错响应：统一改写对外消息，隐藏内部细节
        $message = '请求处理失败';
    }
}
```

## 注意事项

- 四个参数均需在回调签名中使用引用传递（`&$data, &$error, &$code, &$message`）才能生效；
- 该接口在 `ApiResponse()` 的最开头触发，位于 `$error` 信息整理与响应数组组装之前，此时修改 `$error`（如置为 `null`）可以改变响应是按成功还是按错误输出；错误响应中 `$code` 为 200 时系统随后会强制改为 500；
- 与 `Filter_Plugin_API_Response` 的区别：本接口在响应数组组装**之前**触发且错误、成功响应都会经过；`Response` 在组装**之后**触发且只在无错误时执行；如需修改最终响应数组的完整结构应使用后者；
- 模块返回 `raw`、`json` 时走 `ApiResponseRaw()` 输出，不经过本接口，对应环节为 `Filter_Plugin_API_Pre_Response_Raw`。
