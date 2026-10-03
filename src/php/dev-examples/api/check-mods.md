---
title: Z-BlogPHP API 黑白名单扩展
description: 通过 Filter_Plugin_API_CheckMods 接口在 Z-BlogPHP 的 API 模块检查前追加白名单与黑名单规则、控制模块可用性的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_CheckMods
  - 插件接口
  - API
  - 黑白名单
---

# API 黑白名单扩展

通过 `Filter_Plugin_API_CheckMods` 接口，可以在 Z-BlogPHP 的 API 模块黑白名单检查（`ApiCheckMods`）中追加自定义规则，控制哪些模块、动作可以访问，适用于封闭特定 API 端点或启用白名单模式的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_CheckMods` | `&$mods_allow, &$mods_disallow` | API 的黑白名单机制，回调向两个数组追加规则 |

## 完整案例

下例把 `member` 模块的 `put` 动作加入黑名单，禁止通过 API 修改用户资料：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_CheckMods', 'demoAPP_API_CheckMods');
}

function demoAPP_API_CheckMods(&$mods_allow, &$mods_disallow)
{
    // 黑名单：array( 模块名 => 动作名 )，动作名为空字符串时匹配整个模块
    $mods_disallow[] = array('member' => 'put');
    // 白名单慎用：一旦添加了白名单规则，不在白名单内的 mod 都将被拒绝
    // $mods_allow[] = array('post' => '');
}
```

## 注意事项

- 回调签名需使用引用传递（`&$mods_allow, &$mods_disallow`），向数组追加规则后，系统会将其合并进全局黑白名单，然后立即对当前请求的 `mod`、`act` 做检查，未通过则返回 503 错误；
- 规则格式为 `array(模块名 => 动作名)`，动作名为空字符串时匹配该模块下所有动作；黑白名单检查先白后黑：白名单非空时不在名单内的请求直接拒绝，命中黑名单的请求同样拒绝；
- 该接口触发于 API 模块清单载入（`ApiLoadMods`）之后、POST 数据载入与 CSRF 校验之前，是控制模块可用性的正规入口；
- 如只按请求做临时性拦截（如按用户权限），可改用 `Filter_Plugin_API_Dispatch` 接口。
