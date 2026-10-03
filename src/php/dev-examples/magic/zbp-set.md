---
title: Z-BlogPHP 全局属性写入监听接口
description: 通过 Filter_Plugin_Zbp_Set 接口在 Z-BlogPHP 给 $zbp 写入未定义属性时接管处理，实现自定义配置的持久化保存等功能。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Set
  - Zbp_Set
  - 属性写入
  - 魔术方法
  - 插件接口
---

# 全局属性写入监听接口

在 Z-BlogPHP 中给全局对象 `$zbp` 写入未被系统定义的属性时（例如 `$zbp->DemoNotice = '...'`），会触发 `Filter_Plugin_Zbp_Set` 接口，插件可借此接管这类写入，实现自定义配置的读写与持久化。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Set` | `$name, $value` | Zbp 类的魔术方法接口 |

## 完整案例

下例把写入 `$zbp->DemoNotice` 的值保存到插件的配置项中，实现跨请求持久化：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Set', 'demoAPP_Zbp_Set');
}

function demoAPP_Zbp_Set($name, $value)
{
    global $zbp;

    if ($name == 'DemoNotice') {
        // 动态设置 RETURN 信号，本次写入由本回调接管
        SetPluginSignal('Filter_Plugin_Zbp_Set', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        $zbp->Config('demoAPP')->notice = $value;
        $zbp->SaveConfig('demoAPP');
    }
}
```

## 注意事项

- 只在给 `$zbp` 写入未定义的属性时触发；`$zbp->user`、`$zbp->host`、`$zbp->option` 等系统已定义属性有各自的存储方式，不会走到本接口。
- 系统本身不会存储写入的值：默认情况下写入未定义属性只会触发「不存在的属性」警告，回调必须自行决定保存位置（如 `$zbp->Config()`）并在下次读取时配合 `Filter_Plugin_Zbp_Get` 接口返回。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后本次写入才由回调接管，否则系统在回调执行后仍会触发属性不存在的警告。
- 该接口位于全局对象上，回调应严格按 `$name` 过滤并保持轻量，避免影响其他代码的异常写入提示。
