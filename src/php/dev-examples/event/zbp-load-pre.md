---
title: Z-BlogPHP 系统加载预处理扩展
description: 通过 Filter_Plugin_Zbp_Load_Pre 接口在 Z-BlogPHP 正式加载数据前做预处理，如判断移动端并打运行标记的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Load_Pre
  - 插件接口
  - 系统加载
  - 预处理
---

# 系统加载预处理扩展

通过 `Filter_Plugin_Zbp_Load_Pre` 接口，可以在 Z-BlogPHP 的 `Zbp::Load()` 最前部、正式加载数据之前执行预处理逻辑。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Load_Pre` | 无 | Zbp 类的加载（预处理）接口 |

## 完整案例

下例在数据加载前依据 User-Agent 判断移动端，并把标记存入全局供后续模板与过滤器使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Load_Pre', 'demoAPP_Zbp_Load_Pre');
}

function demoAPP_Zbp_Load_Pre()
{
    $ua = GetVars('HTTP_USER_AGENT', 'SERVER', '');

    // 在系统加载数据前打标记，供 Zbp_Load 或模板逻辑使用
    $GLOBALS['demoAPP_is_mobile'] = (stripos($ua, 'mobile') !== false) ? true : false;
}
```

## 注意事项

- 触发位置在 `Zbp::Load()` 的最前部，早于 Content-type 头发送、会员分类模块加载与登录校验；
- 与 `Filter_Plugin_Zbp_PreLoad` 的区别：PreLoad 由 `c_system_base.php` 在调用 `$zbp->Load()` 之前触发，Load_Pre 已处于 `Load()` 流程内部；
- 与 `Filter_Plugin_Zbp_Load` 的区别：本接口触发时登录校验与数据加载均未开始，不能依赖 `$zbp->user` 等结果；
- 命名中的 `_Pre` 即预处理之意，适合做影响本次加载行为的准备工作；
- 回调没有参数，且应避免输出任何内容，以免破坏后续发送的 HTTP 头。
