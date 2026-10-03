---
title: Z-BlogPHP API 分发监听扩展
description: 通过 Filter_Plugin_API_Dispatch 接口在 Z-BlogPHP 的 API 模块分发前按 mod 与 act 做访问控制、日志或重定向的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Dispatch
  - 插件接口
  - API
  - 流程监听
---

# API 分发监听扩展

通过 `Filter_Plugin_API_Dispatch` 接口，可以在 Z-BlogPHP 的 API 模块分发前（`ApiDispatch()` 开头、查找模块文件之前）按模块与动作执行自定义逻辑，适用于访问控制、分发日志等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Dispatch` | `$mods, $mod, $act` | API 分发前触发，`$mods` 为公开模块数组，`$mod`、`$act` 为当前模块名与动作名 |

## 完整案例

下例禁止非管理员用户访问 `member` 模块的管理类动作，越权请求直接报错终止：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Dispatch', 'demoAPP_API_Dispatch');
}

function demoAPP_API_Dispatch($mods, $mod, $act)
{
    global $zbp;
    // 只拦截 member 模块的编辑、删除类动作
    if ($mod == 'member' && in_array($act, array('post', 'delete'))) {
        if (!$zbp->CheckRights('MemberAll')) {
            $zbp->ShowError($GLOBALS['lang']['error']['6'], null, null, null, 403);
        }
    }
}
```

## 注意事项

- 该接口在 API 流程中触发于黑白名单检查（`ApiCheckMods`）之后、模块文件载入与函数调用之前；系统内置的 `ApiExecute()` 内部分发不触发本接口；
- 参数 `$mods` 为 `mod 名 => 模块文件路径` 数组，`$mod`、`$act` 均已转为小写，`$act` 为空时系统随后会按 `get` 处理；
- 回调签名中把 `$mod`、`$act` 声明为引用传递（`&$mod, &$act`）并修改其值，可以改变实际分发到的模块与动作，实现自定义路由重定向；
- 如需整体关闭某些模块的访问，更推荐使用 `Filter_Plugin_API_CheckMods` 接口调整黑白名单；本接口适合做更细粒度的按请求控制。
