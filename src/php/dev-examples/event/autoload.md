---
title: Z-BlogPHP 类自动加载监听接口案例
description: 通过 Filter_Plugin_Autoload 接口介入 Z-BlogPHP 的自动加载流程，实现插件自有类文件的命名空间加载映射。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Autoload
  - 插件接口
  - 自动加载
  - spl_autoload
---

# 类自动加载监听

`Filter_Plugin_Autoload` 接口挂载在 Z-BlogPHP 注册的 `AutoloadClass` 自动加载函数（通过 `spl_autoload_register` 注册）的最前端。当程序访问一个尚未定义的类时，系统会先把类名交给本接口的所有回调，若回调声明接管则由插件负责类文件的加载，否则系统继续按 PSR-4 与 ZBP 模式在 `$autoload_class_dirs` 目录中查找类文件。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Autoload` | `$classname` | 监控 autoload 魔术方法 |

## 完整案例

下例把插件 `lib` 目录下以自身命名空间命名的类文件接入自动加载：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Autoload', 'demoAPP_Autoload', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_Autoload($className)
{
    // 仅接管 demoAPP\ 开头的类，其余类名交还系统加载
    if (strpos($className, 'demoAPP\\') !== 0) {
        return false;
    }
    $file = dirname(__FILE__) . '/lib/' . str_replace('\\', '/', substr($className, 8)) . '.php';
    if (is_readable($file)) {
        include $file;
        return true;
    }
    return false;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_common.php` 的 `AutoloadClass` 函数，注册点为 `zb_system/function/c_system_base.php` 中的 `spl_autoload_register('AutoloadClass')`；
- 本接口的执行循环没有重置信号，注册时把 `Add_Filter_Plugin` 的退出信号参数设为 `PLUGIN_EXITSIGNAL_RETURN`，回调返回后系统即认为类已由插件加载完成，不再执行内置的 PSR-4 与 ZBP 模式查找；
- 该接口在每次未定义类首次访问时触发，频率较高，回调应先做前缀判断并尽快返回，避免对所有类名执行文件查找；
- 声明接管但实际没有成功 `include` 类文件时，后续内置加载流程会被跳过，将直接导致「类不存在」的致命错误，接管前务必确认文件存在；
- 不要在回调中实例化其他未知类，否则会再次触发自动加载造成递归。
