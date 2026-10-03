---
title: Z-BlogPHP 模块属性写入监听扩展
description: 通过 Filter_Plugin_Module_Set 接口监听 Z-BlogPHP 模块对象属性赋值，实现模块内容变更记录等写入监控的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Module_Set
  - 插件接口
  - 模块
  - 写入监听
  - 魔术方法
---

# 模块属性写入监听扩展

通过 `Filter_Plugin_Module_Set` 接口，可以在 Z-BlogPHP 对模块对象进行属性赋值时得到通知，适用于写入审计、数据联动等场景。对 Module 对象任何属性的赋值（如后台编辑模块、系统重建模块内容）都会先触发本接口，之后再由系统写入默认存储。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Set` | `&$module, $name, $value` | 干预 Module 类 Set 方法的接口 |

## 完整案例

下例监听模块内容字段的写入，把每次内容变更记录到插件日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Module_Set', 'demoAPP_Module_Set');
}

function demoAPP_Module_Set(&$module, $name, $value)
{
    global $zbp;
    if ($name != 'Content') {
        return;
    }
    $log = date('Y-m-d H:i:s') . ' module ' . $module->FileName . ' content written, length ' . strlen($value) . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/module.log', $log, FILE_APPEND);
}
```

## 注意事项

- 对模块对象任何属性的赋值都会触发本接口，赋值完成后系统仍会执行默认写入，回调无法阻止或修改本次写入的值（`$value` 是值拷贝）；
- `SourceType` 是只读虚拟属性，对其赋值会被系统直接忽略；`NoRefresh`、`Links` 有专属处理逻辑，同样不触发本接口；
- 模块内容不仅后台编辑时会写入，系统刷新缓存重建模块（`Build`、`AddBuildModule`）时也会对 `Content` 赋值，本接口会随之高频触发，回调逻辑务必轻量；
- 本接口没有返回值语义，注册时无需设置 `PLUGIN_EXITSIGNAL_RETURN` 信号。
