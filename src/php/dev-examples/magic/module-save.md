---
title: Z-BlogPHP 模块保存联动扩展
description: 通过 Filter_Plugin_Module_Save 接口在 Z-BlogPHP 模块保存时执行记录日志、同步数据等联动逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Module_Save
  - 插件接口
  - 模块
  - 保存
  - 魔术方法
---

# 模块保存联动扩展

通过 `Filter_Plugin_Module_Save` 接口，可以在 Z-BlogPHP 保存模块数据时执行自定义逻辑。该接口在模块对象的 `Save` 方法内部、默认写入之前触发（此时系统已完成 `FileName` 小写化、`HtmlID` 补齐等预处理），适用于保存记录、同步外部数据等场景。核心调用点是后台新建或编辑模块（`PostModule` 函数）。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Save` | `&$module` | Module 类的 Save 方法接口 |

## 完整案例

下例在每次模块保存时，把模块文件名、来源与 ID 记录到插件日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Module_Save', 'demoAPP_Module_Save');
}

function demoAPP_Module_Save(&$module)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' module saved ' . $module->FileName . ' (source: ' . $module->Source . ', id: ' . $module->ID . ')' . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/module.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 接口触发时 `FileName` 已被系统强制转为小写，回调内应以小写后的 `FileName` 为准；
- 新建模块时若数据库中已存在同名 `FileName` 的模块，默认流程会保存失败并返回 false；
- 主题包含（themeinclude）类型的模块保存时，默认流程是写入主题 `include` 目录下的文件而非数据库；若用 `PLUGIN_EXITSIGNAL_RETURN` 信号拦截本接口，该默认写入也会被跳过，需自行处理；
- 回调返回值默认无效；如需用返回值替代 `Save` 方法的返回值并跳过默认保存，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位），拦截保存需谨慎。
