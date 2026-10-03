---
title: Z-BlogPHP 全局虚拟属性读取接口
description: 通过 Filter_Plugin_Zbp_Get 接口在 Z-BlogPHP 读取 $zbp 未定义属性时返回自定义虚拟属性，为全局对象扩展只读数据。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Get
  - Zbp_Get
  - 虚拟属性
  - 魔术方法
  - 插件接口
---

# 全局虚拟属性读取接口

在 Z-BlogPHP 中读取全局对象 `$zbp` 上未被系统定义的属性时（例如访问 `$zbp->DemoStartTime`），会触发 `Filter_Plugin_Zbp_Get` 接口，插件可借此为 `$zbp` 扩展只读的虚拟属性，在任意位置直接读取插件提供的数据。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Get` | `$name` | Zbp 类的魔术方法接口 |

## 完整案例

下例为 `$zbp` 添加虚拟属性 `DemoStartTime`，返回当次请求的起始时间戳：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Get', 'demoAPP_Zbp_Get');
}

function demoAPP_Zbp_Get($name)
{
    if ($name == 'DemoStartTime') {
        // 动态设置 RETURN 信号，本次读取使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Zbp_Get', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return isset($GLOBALS['ZBlogPHPStartTime']) ? $GLOBALS['ZBlogPHPStartTime'] : time();
    }
}
```

注册后在任意位置直接读取即可：

```php
echo $zbp->DemoStartTime;
```

## 注意事项

- 只在读取 `$zbp` 上未定义的属性时触发；`$zbp->user`、`$zbp->host`、`$zbp->option`、`$zbp->tables` 等都是系统已定义属性，直接返回，不会走到本接口。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统会触发「不存在的属性」警告。
- 不要在注册时静态传入 `PLUGIN_EXITSIGNAL_RETURN`，否则所有未定义属性的读取都会返回本回调的值，影响其他代码对错误属性的排查。
- 回调中不要读取与 `$name` 同名的属性，避免递归死循环。
