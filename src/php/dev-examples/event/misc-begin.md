---
title: Z-BlogPHP 杂项入口监听扩展
description: 通过 Filter_Plugin_Misc_Begin 接口在 Z-BlogPHP 的 misc 杂项流程中拦截 type、新增自定义杂项页面的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Misc_Begin
  - 插件接口
  - misc
  - 杂项页面
---

# 杂项入口监听扩展

通过 `Filter_Plugin_Misc_Begin` 接口，可以在 Z-BlogPHP 的杂项流程（`cmd.php?act=misc&type=xxx`，实现在 `zb_system/function/c_system_misc.php`）启动时按 `type` 拦截请求，或为系统新增自定义的杂项页面。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Misc_Begin` | `$type` | c_system_misc.php 的启动接口，可以在这里拦截各种 type |

## 完整案例

下例接管 `type=demostats` 的请求，输出本插件的杂项统计页面：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Misc_Begin', 'demoAPP_Misc_Begin');
}

function demoAPP_Misc_Begin($type)
{
    global $zbp;

    // 只接管本插件约定的 type，其余交回系统默认流程
    if ($type != 'demostats') {
        return;
    }

    // misc 各页面的权限检查在各自的 misc_ 函数内进行，插件自行输出页面时需自行校验
    if (!$zbp->CheckRights('misc')) {
        $zbp->ShowError(6, __FILE__, __LINE__);
    }

    echo '<!DOCTYPE html><html><head><meta charset="utf-8"><title>插件状态</title></head><body>';
    echo '<p>Z-BlogPHP 版本：' . $GLOBALS['option']['ZC_BLOG_PRODUCT_FULL'] . '</p>';
    echo '<p>访客 IP：' . GetGuestIP() . '</p>';
    echo '</body></html>';
    exit;
}
```

## 注意事项

- 触发位置在 `zb_system/cmd.php` 的 `case 'misc'` 分支（`c_system_misc.php` 已被包含），回调参数为 URL 中 `type` 的值，系统已预先去除其中的特殊字符；
- 本接口触发后，系统会调用名为 `misc_{$type}` 的全局函数输出页面；插件也可以直接定义 `misc_自定义type()` 函数来新增杂项页面，让 hook 未拦截时同样可用；
- 权限校验位于各个 `misc_` 函数内部而非 hook 之前，插件自行输出页面时应调用 `$zbp->CheckRights()` 自行校验；
- 若回调把参数声明为引用（`&$type`），修改它将改变随后被调用的 `misc_` 函数名，可用于重定向杂项类型。
