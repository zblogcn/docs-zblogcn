---
title: Z-BlogPHP 插件启用联动监听接口案例
description: Filter_Plugin_EnablePlugin 是 Z-BlogPHP 的插件启用监听接口，可用于插件被启用时初始化配置、计划任务等联动逻辑。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_EnablePlugin
  - 插件接口
  - 应用管理
  - 插件启用
---

# 插件启用联动监听

`Filter_Plugin_EnablePlugin` 对应 Z-BlogPHP 应用管理中的启用插件流程。核心的 `EnablePlugin()` 函数负责把插件 ID 写入 `ZC_USING_PLUGIN_LIST` 配置并保存，本接口设计用于在该流程中执行联动逻辑，例如为被启用的插件初始化默认配置、创建数据表或注册计划任务。接口于 1.6.0 加入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_EnablePlugin` | `&$name` | EnablePlugin（1.6.0 加入） |

## 完整案例

按源码注释意图，下例演示「任意插件被启用时记录启用日志，自身被启用时完成默认配置初始化」的联动场景：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_EnablePlugin', 'demoAPP_EnablePlugin');
}

function demoAPP_EnablePlugin(&$name)
{
    global $zbp;
    if ($name === 'demoAPP') {
        // 首次启用时写入默认配置
        $zbp->Config('demoAPP')->interval = 60;
        $zbp->Config('demoAPP')->version = '1.0';
        $zbp->SaveConfig('demoAPP');
    }
}
```

## 注意事项

- 核心程序当前未调用此接口（预留接口）：`EnablePlugin()` 函数本体在 1.7.3 源码中只完成兼容性检查、写入 `ZC_USING_PLUGIN_LIST` 与保存配置，并未遍历本接口的回调，本案例按源码注释的意图编写；
- 由于接口未被触发，上述初始化逻辑实际不会随启用流程自动执行，仅可用于为将来的版本预留兼容代码；
- 在当前版本中实现同类需求的可靠方式是使用插件内置的安装函数：在插件主文件中定义 `InstallPlugin_demoAPP()`，插件被启用（或安装）时核心会自动调用它；对应的卸载清理可定义 `UninstallPlugin_demoAPP()`；
- 回调的 `$name` 按声明为引用参数（`&$name`）设计，含义是被启用（或正被处理）的插件 ID，回调中不应随意修改该值；
- 若未来版本启用该接口，回调中请注意 `EnablePlugin()` 流程尚在保存配置的过程中，避免执行依赖目标插件已完成启用的操作。
