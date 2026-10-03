---
title: Z-BlogPHP 系统预加载监听扩展
description: 通过 Filter_Plugin_Zbp_PreLoad 接口在 Z-BlogPHP 系统正式 Load 之前记录请求开始时间、做轻量预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_PreLoad
  - 插件接口
  - 系统加载
  - 预加载
---

# 系统预加载监听扩展

通过 `Filter_Plugin_Zbp_PreLoad` 接口，可以在 Z-BlogPHP 的 `Zbp::PreLoad()` 中、系统正式 `$zbp->Load()` 之前执行最早介入的自定义逻辑，适合记录请求开始时间、准备运行环境等轻量预处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_PreLoad` | 无 | Zbp 类的预加载接口 |

## 完整案例

下例在预加载阶段记录请求开始时间，供 `Filter_Plugin_Zbp_Terminate` 收尾时统计耗时：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_PreLoad', 'demoAPP_Zbp_PreLoad');
}

function demoAPP_Zbp_PreLoad()
{
    // 记录请求开始时间，Terminate 时计算整次请求耗时
    $GLOBALS['demoAPP_start_time'] = microtime(true);
}
```

## 注意事项

- 触发位置在 `Zbp::PreLoad()` 内，由 `zb_system/function/c_system_base.php` 末尾调用，位于所有启用插件的 `include.php` 与 `ActivePlugin_*` 函数执行之后、`$zbp->Load()` 之前；
- 此时 `$zbp` 只完成基础初始化，会员、分类、模块、模板、登录状态等均未加载，可用功能有限，只适合做轻量准备工作；
- 核心自身在 API 模式下会把 Token 校验（`ApiTokenVerify`）挂载到本接口上，可见其作为最早介入点的定位；
- 同一次请求中 `PreLoad()` 只会执行一次，内部有 `ispreload` 状态保护；
- 数据库连接虽已就绪，但业务数据尚未加载，不要在本阶段读取会员、文章等数据或输出内容。
