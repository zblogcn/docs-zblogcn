---
title: Z-BlogPHP 模块虚拟属性读取扩展
description: 通过 Filter_Plugin_Module_Get 接口为 Z-BlogPHP 侧栏模块对象定义虚拟属性，读取模块未定义属性时返回动态值的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Module_Get
  - 插件接口
  - 模块
  - 虚拟属性
  - 魔术方法
---

# 模块虚拟属性读取扩展

通过 `Filter_Plugin_Module_Get` 接口，可以在 Z-BlogPHP 读取模块对象上未专属处理的属性时介入，为 Module 对象定义虚拟属性或动态计算值。读取模块对象的任何属性（如 `$module->FileName`、`$module->Content`）都会先经过本接口，回调不返回时再交回系统默认读取。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Get` | `&$module, $name` | 干预 Module 类 Get 方法的接口 |

## 完整案例

下例为模块对象定义一个虚拟属性 `TypeText`，输出模块显示类型的中文名称：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Module_Get', 'demoAPP_Module_Get');
}

function demoAPP_Module_Get(&$module, $name)
{
    global $zbp;
    if ($name != 'TypeText') {
        // 不是目标属性时立即返回，交回系统默认读取
        return;
    }
    // 置位 RETURN 信号，让本次返回值作为属性的读取结果
    $GLOBALS['Filter_Plugin_Module_Get']['demoAPP_Module_Get'] = PLUGIN_EXITSIGNAL_RETURN;
    return $module->Type == 'ul' ? '列表模块' : '内容模块';
}
```

## 注意事项

- `SourceType`、`NoRefresh`、`Links`、`ContentWithoutId`、`AutoContent` 这几个属性由系统专属处理，不会经过本接口；除此之外的所有属性读取都会先触发回调，再走默认读取；
- 回调返回值需配合 `PLUGIN_EXITSIGNAL_RETURN` 信号才能替代属性值，信号在每次生效后被系统重置，要在回调内每次置位（如案例写法）；不置位时返回值会被忽略，默认读取照常进行；
- 页面渲染、后台模块管理等场景都会频繁读取模块属性，回调开头必须先判断属性名，非目标属性立即返回；
- 回调内访问其他属性时注意避开会再次进入本接口的属性名，防止递归。
