---
title: Z-BlogPHP 关站检查拦截扩展
description: 通过 Filter_Plugin_Zbp_CheckSiteClosed 接口在 Z-BlogPHP 站点关闭状态下按白名单放行管理员与本地访问的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_CheckSiteClosed
  - 插件接口
  - 关站检查
  - 访问控制
---

# 关站检查拦截扩展

通过 `Filter_Plugin_Zbp_CheckSiteClosed` 接口，可以在 Z-BlogPHP 的 `Zbp::CheckSiteClosed()` 中拦截关站检查：回调按约定返回真值时，站点关闭状态下仍可放行指定访问。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_CheckSiteClosed` | 无 | Zbp 类的跳出关站检查接口 |

## 完整案例

下例在站点关闭期间放行管理员与本机回环地址的访问：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_CheckSiteClosed', 'demoAPP_CheckSiteClosed');
}

function demoAPP_CheckSiteClosed()
{
    global $zbp;

    $allow = false;
    if ($zbp->CheckRights('admin')) {
        $allow = true;
    }
    if (GetGuestIP() == '127.0.0.1') {
        $allow = true;
    }

    if ($allow) {
        // 置为 RETURN 信号并返回 true，即可跳过核心的关站检查
        $GLOBALS['hooks']['Filter_Plugin_Zbp_CheckSiteClosed']['demoAPP_CheckSiteClosed'] = PLUGIN_EXITSIGNAL_RETURN;
        return true;
    }
}
```

## 注意事项

- 触发位置在 `Zbp::CheckSiteClosed()` 开头；不拦截时核心检查 `ZC_CLOSE_SITE` 选项，开启关站则输出 503 与「网站已关闭」错误并终止请求；
- 只有回调设置 `PLUGIN_EXITSIGNAL_RETURN` 信号并返回真值时才会跳过关站检查，未设置信号时返回值不起作用；
- 调用点在前台流程（核心把 `Include_Index_Begin` 挂载于 `Filter_Plugin_Index_Begin` 等接口，其中调用本检查）与 `zb_system/xml-rpc/index.php` 入口，后台管理不受关站限制；
- 该调用发生在 `$zbp->Load()` 之后，回调中可以使用已加载的完整系统功能；
- 放行条件务必收敛（如仅限管理员或 IP 白名单），避免网站关闭功能形同虚设。
