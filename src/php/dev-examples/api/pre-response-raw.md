---
title: Z-BlogPHP API 原始输出处理扩展
description: 通过 Filter_Plugin_API_Pre_Response_Raw 接口在 Z-BlogPHP 的 API 原始内容输出前修改内容与 Content-Type 的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Pre_Response_Raw
  - 插件接口
  - API
  - 响应处理
---

# API 原始输出处理扩展

通过 `Filter_Plugin_API_Pre_Response_Raw` 接口，可以在 Z-BlogPHP 的 API 原始内容输出函数（`ApiResponseRaw`）输出前修改原始内容与响应类型，适用于处理模块返回的 `raw`、`json` 自定义格式数据的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Pre_Response_Raw` | `&$raw, &$raw_type` | 处理返回的原始数据，`$raw` 为原始输出内容，`$raw_type` 为 Content-Type |

## 完整案例

下例在原始内容输出前记录日志，并为 JSON 内容追加签名字段：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Pre_Response_Raw', 'demoAPP_API_Pre_Response_Raw');
}

function demoAPP_API_Pre_Response_Raw(&$raw, &$raw_type)
{
    global $zbp;
    // 记录原始输出日志
    $file = $zbp->usersdir . 'plugin/demoAPP/raw.log';
    file_put_contents($file, date('Y-m-d H:i:s') . ' ' . $raw_type . PHP_EOL, FILE_APPEND);
    // JSON 内容追加签名字段
    if ($raw_type == 'application/json' && ($data = json_decode($raw, true)) && is_array($data)) {
        $data['demoapp_signed'] = true;
        $raw = json_encode($data);
    }
}
```

## 注意事项

- 两个参数均需在回调签名中使用引用传递（`&$raw, &$raw_type`）才能生效；
- 该接口在 `ApiResponseRaw()` 开头触发，只覆盖走原始输出路径的响应：模块返回 `raw`（可附带 `raw-type` 指定类型）或 `json` 键时触发；常规的 `data` 结构响应走 `ApiResponse()`，不经过本接口；
- `$raw` 不一定是 JSON 字符串，修改内容前应先判断 `$raw_type` 并做解码校验，避免破坏其他格式的输出；
- `$raw_type` 会直接作为响应头 `Content-Type` 输出，修改时应使用合法的 MIME 类型。
