---
title: Z-BlogPHP API 返回数据处理扩展
description: 通过 Filter_Plugin_API_Result_Data 接口在 Z-BlogPHP 的 API 模块函数返回数据后、组装响应前包装或修改返回数据的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Result_Data
  - 插件接口
  - API
  - 返回数据
---

# API 返回数据处理扩展

通过 `Filter_Plugin_API_Result_Data` 接口，可以在 Z-BlogPHP 的 API 模块函数返回数据后（`ApiDispatch` 调用 `ApiResultData` 时）、响应组装之前对返回数据做统一处理，适用于为返回结果追加公共字段、按模块修改数据等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Result_Data` | `&$result, $mod, $act` | 处理返回数据，`$result` 为模块函数返回的数组，`$mod`、`$act` 为当前模块名与动作名 |

## 完整案例

下例为所有成功返回的 API 响应数据追加服务端时间戳：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Result_Data', 'demoAPP_API_Result_Data');
}

function demoAPP_API_Result_Data(&$result, $mod, $act)
{
    // $result 通常包含 data、error、code、message，也可能包含 raw、json 键
    if (isset($result['data']) && is_array($result['data'])) {
        $result['data']['demoapp_server_time'] = time();
    }
}
```

## 注意事项

- 参数 `$result` 需在回调签名中使用引用传递 `&$result`，由于系统函数 `ApiResultData` 本身按引用接收该数组，回调内的修改会直接改变后续响应内容；
- 该接口在 `ApiDispatch()` 中模块函数执行完毕后、`ApiResponse()` 或 `ApiResponseRaw()` 调用之前触发，是模块数据进入响应流程前最后一个可统一修改的环节；
- `$result` 的结构由模块函数决定：常规结构为 `array('data' => ..., 'error' => ..., 'code' => ..., 'message' => ...)`，返回原始内容时则含 `raw` 或 `json` 键，处理前应先判断键是否存在；
- `$mod`、`$act` 为当前请求的模块名与动作名（均已小写），可用于只对特定端点做处理。
