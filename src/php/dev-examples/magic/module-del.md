---
title: Z-BlogPHP 模块删除联动扩展
description: 通过 Filter_Plugin_Module_Del 接口在 Z-BlogPHP 删除模块时清理关联数据、记录日志等联动操作的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Module_Del
  - 插件接口
  - 模块
  - 删除
  - 魔术方法
---

# 模块删除联动扩展

通过 `Filter_Plugin_Module_Del` 接口，可以在 Z-BlogPHP 删除模块时执行自定义逻辑。该接口在模块对象的 `Del` 方法内部、默认删除之前触发，适用于清理插件与该模块关联的数据、记录删除日志等场景。核心调用点是后台删除模块操作（`DelModule` 函数）。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Del` | `&$module` | Module 类的 Del 方法接口 |

## 完整案例

下例在模块被删除时，记录删除日志（可作为同步清理外部系统数据的依据）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Module_Del', 'demoAPP_Module_Del');
}

function demoAPP_Module_Del(&$module)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' module deleted ' . $module->FileName . ' (source: ' . $module->Source . ')' . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/module.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 核心仅删除非系统模块（`Source != 'system'` 且 `ID != 0`），系统模块的删除流程不会触发本接口；按主题来源删除时（`source=theme`）通过 `FileName` 定位模块后删除，同样会触发；
- 主题包含（themeinclude）类型的模块删除时，默认流程会同时删除主题 `include` 目录下对应的 `.htm` 与 `.php` 文件；
- 回调触发时模块数据尚未删除，仍可读取 `FileName`、`Source` 等属性；
- 回调返回值默认无效；如需用返回值替代 `Del` 方法的返回值并跳过默认删除，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位），拦截删除需谨慎。
