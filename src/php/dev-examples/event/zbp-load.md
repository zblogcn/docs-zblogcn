---
title: Z-BlogPHP 系统加载监听扩展
description: 通过 Filter_Plugin_Zbp_Load 接口在 Z-BlogPHP 数据加载与登录校验完成后做初始化与访问统计的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Load
  - 插件接口
  - 系统加载
  - 初始化
---

# 系统加载监听扩展

通过 `Filter_Plugin_Zbp_Load` 接口，可以在 Z-BlogPHP 的 `Zbp::Load()` 末段、系统数据加载与登录校验完成之后执行自定义逻辑，适合做依赖完整系统环境的初始化。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Load` | 无 | Zbp 类的加载接口 |

## 完整案例

下例在系统加载完成后读取插件配置，开启时记录最近访客：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Load', 'demoAPP_Zbp_Load');
}

function demoAPP_Zbp_Load()
{
    global $zbp;

    // 读取插件配置（此时配置与用户数据均已就绪）
    if ($zbp->Config('demoAPP')->openstats != '1') {
        return;
    }

    $who = $zbp->user->ID ? $zbp->user->Name : 'guest';
    $log = date('Y-m-d H:i:s') . ' ' . $who . ' ' . GetGuestIP() . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/visit.log', $log, FILE_APPEND | LOCK_EX);
}
```

## 注意事项

- 触发位置在 `Zbp::Load()` 内部靠后位置：会员、分类、模块已加载，登录状态已校验，模板类已创建，核心默认过滤器已注册；
- 与 `Filter_Plugin_Zbp_Load_Pre` 的区别：Load_Pre 在 `Load()` 一开始触发，此时上述数据尚未加载；
- 后台管理请求会随后继续触发 `Filter_Plugin_Zbp_LoadManage`，前台请求则不会；
- 登录用户被锁定时的错误抛出（错误码 80）发生在本接口之后，需要在锁定前拦截的话应在回调中自行处理；
- 回调没有参数，适合做初始化与统计，不宜输出正文内容。
