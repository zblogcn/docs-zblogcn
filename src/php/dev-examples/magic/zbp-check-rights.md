---
title: Z-BlogPHP 用户权限检查接口
description: 通过 Filter_Plugin_Zbp_CheckRights 接口在 Z-BlogPHP 调用 CheckRights 检查权限时接管判断结果，实现自定义权限规则与访问控制。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_CheckRights
  - CheckRights
  - 权限检查
  - 访问控制
  - 插件接口
---

# 用户权限检查接口

在 Z-BlogPHP 中调用 `$zbp->CheckRights($action)` 检查当前用户权限时会触发 `Filter_Plugin_Zbp_CheckRights` 接口，回调可以接管权限判断结果，实现时段限制、自定义用户组权限等自定义访问控制逻辑。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_CheckRights` | `$action` | Zbp 类的检查权限接口（检查当前用户） |

## 完整案例

下例在每天 0 点至 6 点禁止管理员以外的用户进入后台管理页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_CheckRights', 'demoAPP_Zbp_CheckRights');
}

function demoAPP_Zbp_CheckRights($action, $level = null)
{
    global $zbp;

    if ($action == 'admin' && $level > 1 && (int) date('G') < 6) {
        // 动态设置 RETURN 信号，本次权限检查使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Zbp_CheckRights', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return false;
    }
}
```

## 注意事项

- 该接口触发极其频繁：前台浏览、后台操作等几乎所有权限判断都会经过 `$zbp->CheckRights()`，回调必须严格按 `$action` 过滤并保持轻量，避免拖慢全站。
- 实际调用时会同时传入 `$action`（动作名）与 `$level`（用户等级）两个参数，回调建议声明为 `($action, $level = null)`。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才作为本次权限检查的结果，否则系统继续按用户等级与动作所需等级的默认规则判断。
- 不要在回调中再调用 `$zbp->CheckRights()`，避免递归死循环。
