---
title: Z-BlogPHP API CSRF 校验跳过扩展
description: 通过 Filter_Plugin_API_VerifyCSRF_Skip 接口在 Z-BlogPHP 的 API 中为指定模块动作追加 CSRF 校验跳过名单的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_VerifyCSRF_Skip
  - 插件接口
  - API
  - CSRF
---

# API CSRF 校验跳过扩展

通过 `Filter_Plugin_API_VerifyCSRF_Skip` 接口，可以在 Z-BlogPHP 的 API 执行 CSRF Token 校验（`ApiVerifyCSRF`）前，为指定的模块与动作追加跳过名单，适用于自定义模块的 POST 端点不便携带 `csrf_token` 时的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_VerifyCSRF_Skip` | `&$skip_acts` | API 校验 CSRF Token 跳过验证，`$skip_acts` 为跳过名单数组 |

## 完整案例

下例为自定义模块 `demo` 的 `post` 动作跳过 CSRF 校验：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_VerifyCSRF_Skip', 'demoAPP_API_VerifyCSRF_Skip');
}

function demoAPP_API_VerifyCSRF_Skip(&$skip_acts)
{
    // 系统默认已跳过 member#login 与 comment#post
    $skip_acts[] = array('mod' => 'demo', 'act' => 'post');
}
```

## 注意事项

- 参数 `$skip_acts` 需在回调签名中使用引用传递 `&$skip_acts`；名单元素格式为 `array('mod' => 模块名, 'act' => 动作名)`，只定义 `mod` 时匹配该模块下所有动作；
- 该接口只在传统登录（非 Token 认证）且请求方法为 POST 时参与校验流程：GET 请求本身不校验 CSRF，通过 `Authorization: Bearer` Token 登录的请求也整体跳过校验；
- **安全风险**：跳过 CSRF 校验意味着该端点不再防御跨站伪造提交，跳过名单应只覆盖确实无法携带 `csrf_token` 的端点，并自行做好权限校验与频率限制；跳过系统内置端点（如从默认名单中移除 `comment#post` 以加强校验）需充分测试；
- 命中跳过名单的请求在分发后仍会正常执行模块函数内的登录与权限检查，本接口只影响 CSRF 这一环节。
