---
title: Z-BlogPHP 插件停用联动监听接口案例
description: Filter_Plugin_DisablePlugin 是 Z-BlogPHP 的插件停用监听接口，可用于插件被停用时清理配置、计划任务等联动逻辑。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DisablePlugin
  - 插件接口
  - 应用管理
  - 插件停用
---

# 插件停用联动监听

`Filter_Plugin_DisablePlugin` 对应 Z-BlogPHP 应用管理中的停用插件流程。核心的 `DisablePlugin()` 函数会先对插件执行 `UninstallPlugin()` 卸载处理，再把插件 ID 从 `ZC_USING_PLUGIN_LIST` 配置中移除并保存，本接口设计用于在该流程中执行联动清理逻辑。接口于 1.6.0 加入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DisablePlugin` | `&$name` | DisablePlugin（1.6.0 加入） |

## 完整案例

按源码注释意图，下例演示「插件被停用时删除自身的临时缓存文件」的联动场景：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DisablePlugin', 'demoAPP_DisablePlugin');
}

function demoAPP_DisablePlugin(&$name)
{
    if ($name === 'demoAPP') {
        // 停用时清理插件运行期间生成的临时缓存
        $cacheDir = dirname(__FILE__) . '/cache/';
        if (is_dir($cacheDir)) {
            foreach (glob($cacheDir . '*.tmp') as $file) {
                unlink($file);
            }
        }
    }
}
```

## 注意事项

- 核心程序当前未调用此接口（预留接口）：`DisablePlugin()` 函数本体在 1.7.3 源码中只完成兼容性检查、调用 `UninstallPlugin()`、从 `ZC_USING_PLUGIN_LIST` 移除插件 ID 与保存配置，并未遍历本接口的回调，本案例按源码注释的意图编写；
- 在当前版本中实现同类清理需求的可靠方式是定义插件卸载函数 `UninstallPlugin_demoAPP()`，核心的 `DisablePlugin()` 流程会自动调用它，插件停用时即完成清理；
- 回调的 `$name` 按声明为引用参数（`&$name`）设计，含义是被停用（或正被处理）的插件 ID，回调中不应随意修改该值；
- 编写联动清理逻辑时应注意幂等：同一插件可能被反复启用、停用，清理操作不应依赖只在首次停用时成立的条件；
- 若未来版本启用该接口，回调中不应执行依赖目标插件仍在启用状态的操作，因为该流程中卸载与配置移除可能已经发生。
