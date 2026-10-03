---
title: Z-BlogPHP 全局虚拟方法接口
description: 通过 Filter_Plugin_Zbp_Call 接口在 Z-BlogPHP 调用 $zbp 不存在的方法时返回自定义虚拟方法，为全局对象扩展可带参数的行为。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Call
  - Zbp_Call
  - 虚拟方法
  - 魔术方法
  - 插件接口
---

# 全局虚拟方法接口

在 Z-BlogPHP 中调用全局对象 `$zbp` 上不存在的方法时（例如 `$zbp->DemoVersion()`），会触发 `Filter_Plugin_Zbp_Call` 接口，插件可借此为 `$zbp` 扩展「虚拟方法」，在任意模板、主题、插件代码中以对象方法的形式调用插件提供的功能。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Call` | `$method, $args` | Zbp 类的魔术方法接口 |

## 完整案例

下例为 `$zbp` 添加虚拟方法 `DemoVersion()`，返回插件的版本号：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Call', 'demoAPP_Zbp_Call');
}

function demoAPP_Zbp_Call($method, $args)
{
    if ($method == 'DemoVersion') {
        // 动态设置 RETURN 信号，本次调用使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Zbp_Call', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return '1.0';
    }
}
```

注册后在任意位置直接调用即可：

```php
echo $zbp->DemoVersion();
```

## 注意事项

- 只在调用 `$zbp` 上真实不存在的方法时触发；`$zbp->GetPostList()`、`$zbp->GetMemberByID()` 等 `GetXxxList`、`GetXxxByID`、`GetXxxByArray` 形式的方法由系统内置的转发规则处理，且本接口的回调先于这些内置规则执行。
- 回调不会收到 `$zbp` 对象本身，需要使用全局对象时在回调内 `global $zbp;` 即可；`$args` 是索引数组，按调用时的参数顺序排列。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统继续尝试内置转发规则，仍无法匹配时会触发方法不存在的警告。
- 该接口位于全局对象上，任何代码调用未知方法都会走到这里，回调的条件判断务必放在最前并保持轻量。
