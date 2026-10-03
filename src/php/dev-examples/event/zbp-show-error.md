---
title: Z-BlogPHP 错误输出监听扩展
description: 通过 Filter_Plugin_Zbp_ShowError 接口在 Z-BlogPHP 错误输出时接管 404 等错误页面的完整插件案例，含废弃说明与替代接口提示。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_ShowError
  - 插件接口
  - 错误页
  - 404
---

# 错误输出监听扩展

通过 `Filter_Plugin_Zbp_ShowError` 接口，可以在 Z-BlogPHP 调用 `Zbp::ShowError()` 输出错误时接管错误展示，例如为内容不存在（错误码 2）渲染自定义 404 页面。

> 注意：该接口自 1.7.3 起已废弃，新插件请使用参数不变的 `Filter_Plugin_Debug_Handler_Common` 接口；核心目前仍会触发本接口，旧插件可继续运行。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_ShowError` | 无（回调接收 `$errorCode, $errorText, $file, $line, $moreinfo, $httpcode`） | 1.7.3 已废弃，请使用 `Filter_Plugin_Debug_Handler_Common` 接口，参数不变 |

## 完整案例

下例在错误码为 2（内容不存在，默认 HTTP 404）时输出自定义 404 页面，其余错误交回系统默认流程：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_ShowError', 'demoAPP_Zbp_ShowError');
}

function demoAPP_Zbp_ShowError($errorCode, $errorText, $file, $line, $moreinfo, $httpcode)
{
    global $zbp;

    // 只接管 404，其余错误走系统默认错误页
    if ((int) $errorCode != 2) {
        return;
    }

    SetHttpStatusCode(404);
    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>404</title></head><body>';
    echo '<h1>404</h1><p>页面不存在，<a href="' . $zbp->host . '">返回首页</a>。</p>';
    echo '</body></html>';
    exit;
}
```

## 注意事项

- 触发位置在 `Zbp::ShowError()` 内，早于系统抛出 `ZbpErrorException` 异常与默认错误页展示；回调参数依次为 `$errorCode, $errorText, $file, $line, $moreinfo, $httpcode`；
- 错误码 2 对应「内容不存在」且默认 HTTP 状态码为 404，错误码 8 为登录失败、82 为网站已关闭，详见语言文件 `error` 数组；
- 在回调中把自身信号置为 `PLUGIN_EXITSIGNAL_RETURN` 并返回值，可以让 `ShowError()` 不再抛出异常；本例直接输出页面后 `exit`，效果相同且更直接；
- API 模式下核心会把 `ApiShowError` 挂载到本接口，把错误输出接管为 JSON，接管逻辑需考虑与 API 场景共存；
- 1.7.3 起官方推荐改用 `Filter_Plugin_Debug_Handler_Common`，无须改动插件函数的参数。
