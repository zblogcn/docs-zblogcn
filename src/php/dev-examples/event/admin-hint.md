---
title: Z-BlogPHP 后台提示区域监听接口案例
description: 通过 Filter_Plugin_Admin_Hint 接口在 Z-BlogPHP 后台每个管理页的顶部提示区域输出自定义提示内容。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Hint
  - 插件接口
  - 后台管理
  - 提示信息
---

# 后台提示区域监听

`Filter_Plugin_Admin_Hint` 挂载在后台公共顶部文件 `admin_top.php` 中，紧跟系统自身的 `$zbp->GetHint()` 输出之后触发。由于所有后台管理页都会引入该文件，本接口为插件提供了一个在后台每个页面顶部提示区域输出内容的统一入口，核心自身即用它实现了管理员弱口令检查提醒。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Hint` | 无 | 定义后台首页 hint 接口 |

## 完整案例

下例在插件尚未完成初始化配置时，于后台每个页面顶部显示一条持续显示的提醒：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_Hint', 'demoAPP_Admin_Hint');
}

function demoAPP_Admin_Hint()
{
    global $zbp;
    // 无参数回调，可使用 ShowHint 输出与系统一致的提示条
    if (!$zbp->Config('demoAPP')->HasKey('initialized')) {
        $zbp->ShowHint('bad', '演示插件尚未完成初始化，请先进入插件设置页完成配置。', 9999);
    }
}
```

## 注意事项

- 触发位置在 `zb_system/admin/admin_top.php` 的 `$zbp->GetHint(); HookFilterPlugin('Filter_Plugin_Admin_Hint');` 处，后台每个管理页加载时触发一次；
- 回调无参数、无返回值处理，内容输出依赖插件自己完成；使用 `$zbp->ShowHint('bad' 或 'good', 文本, 显示时长)` 可输出与系统提示一致样式的提示条，也可以直接 `echo` 自定义 HTML；
- 核心内置的弱口令检查（`Include_Admin_CheckWeakPassWord`）就注册在本接口上，插件回调与系统回调按注册顺序执行；
- 该接口在所有后台页面触发，回调中务必先做条件判断再输出，避免每个页面都重复弹提示；涉及跳转时注意不要在编辑页形成重定向循环；
- 输出 HTML 时应对动态内容做转义，提示文案尽量精简，避免过长的提示条影响后台各功能页的可用性。
