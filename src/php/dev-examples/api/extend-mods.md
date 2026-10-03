---
title: Z-BlogPHP API 自定义模块扩展
description: 通过 Filter_Plugin_API_Extend_Mods 接口为 Z-BlogPHP 的 API 注册自定义模块，扩展出新的 mod 接口端点的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Extend_Mods
  - 插件接口
  - API
  - 自定义模块
---

# API 自定义模块扩展

通过 `Filter_Plugin_API_Extend_Mods` 接口，可以为 Z-BlogPHP 的 API 注册自定义模块，在系统与插件自带的 `mod` 之外扩展出新的接口端点，适用于插件对外提供自有 API 的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Extend_Mods` | 无 | 载入 API 模块清单（`ApiLoadMods`）时触发，回调返回 `array(模块名 => 文件路径)` |

## 完整案例

下例为 API 注册一个 `demo` 模块，并实现 `mod=demo&act=hello` 端点：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Extend_Mods', 'demoAPP_API_Extend_Mods');
}

function demoAPP_API_Extend_Mods()
{
    // 返回 模块名 => 模块文件路径 数组，模块名会被转为小写
    return array(
        'demo' => dirname(__FILE__) . '/api/demo.php',
    );
}
```

模块文件 `demoAPP/api/demo.php` 的内容：

```php
<?php

// 函数名为 api_模块名_动作名，对应 mod=demo&act=hello
function api_demo_hello()
{
    return array(
        'data' => array(
            'message' => 'hello, this is demoAPP api',
            'time' => time(),
        ),
    );
}
```

## 注意事项

- 回调函数不接收参数，通过**返回值**提交模块清单：键为模块名（注册时转为小写），值为模块文件路径；返回值不是数组时会被忽略；
- 模块文件内定义 `api_模块名_动作名` 形式的函数即可被 `ApiDispatch` 调用，函数返回的数组可包含 `data`、`error`、`code`、`message`、`raw`、`json` 等键；
- 该接口在系统内置模块载入（`ApiLoadSystemMods`）之前触发，若注册的模块名与系统模块同名，会被系统目录中的同名模块覆盖；
- 注册自定义模块后，客户端通过 `?mod=模块名&act=动作名` 访问；新模块的权限控制需在模块函数内自行调用 `ApiCheckAuth` 等函数完成。
