---
title: Z-BlogPHP 后台加载监听扩展
description: 通过 Filter_Plugin_Zbp_LoadManage 接口在 Z-BlogPHP 后台管理流程加载时做插件版本升级检查等初始化的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_LoadManage
  - 插件接口
  - 后台管理
  - 初始化
---

# 后台加载监听扩展

通过 `Filter_Plugin_Zbp_LoadManage` 接口，可以在 Z-BlogPHP 进入后台管理流程（`Zbp::LoadManage()`）时执行插件自身的后台初始化逻辑。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_LoadManage` | 无 | Zbp 类的后台管理初始加载接口 |

## 完整案例

下例在后台加载时检查插件版本号，有新版本则写入升级标记并记录系统日志：

```php
<?php

define('DEMOAPP_VERSION', '1.1');

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_LoadManage', 'demoAPP_Zbp_LoadManage');
}

function demoAPP_Zbp_LoadManage()
{
    global $zbp;

    $cfg = $zbp->Config('demoAPP');
    if ($cfg->version != DEMOAPP_VERSION) {
        $cfg->version = DEMOAPP_VERSION;
        $cfg->Save();
        Logs('demoAPP 已升级到 ' . DEMOAPP_VERSION);
    }
}
```

## 注意事项

- 触发位置在 `Zbp::LoadManage()` 内；该方法由 `Zbp::Load()` 在后台管理流程（`ismanage` 为真，即经 `admin/index.php` 等后台入口访问）时调用，前台请求不会触发；
- 核心自身把自动升级数据库的回调（`Include_Admin_UpdateDB`）挂载在本接口上，可见其定位是后台初始化与升级处理；
- 此时机晚于 `Filter_Plugin_Zbp_Load`，用户权限、配置等均已就绪；
- 回调没有参数；由于它位于每次后台页面加载的路径上，逻辑应保持轻量，避免拖慢所有后台页面；
- 适合做数据表检查、版本升级、后台菜单注册前的准备等一次性初始化动作。
