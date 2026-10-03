---
title: Z-BlogPHP Ajax 命令监听扩展
description: 通过 Filter_Plugin_Cmd_Ajax 接口在 Z-BlogPHP 的 cmd.php 中注册自定义 Ajax 数据接口，含自行判断权限的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Cmd_Ajax
  - 插件接口
  - Ajax
  - 前端交互
---

# Ajax 命令监听扩展

通过 `Filter_Plugin_Cmd_Ajax` 接口，可以在 Z-BlogPHP 的指令入口 `zb_system/cmd.php` 的 Ajax 分支中注册自定义数据接口，供前台 JavaScript 以 `cmd.php?act=ajax&src=xxx` 的方式调用。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Cmd_Ajax` | 无（回调接收 `src` 参数） | cmd.php 的 Ajax 命令专用接口，插件需要自行判断权限 |

## 完整案例

下例注册一个 `src=demostats` 的 Ajax 接口，返回服务器时间与版本信息，并自行校验登录状态：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Cmd_Ajax', 'demoAPP_Cmd_Ajax');
}

function demoAPP_Cmd_Ajax($src)
{
    global $zbp;

    // 只处理本插件约定的 src 值，其他交回给别的插件
    if ($src != 'demostats') {
        return;
    }

    // Ajax 动作对访客级别开放，权限必须由插件自行判断
    if (!$zbp->user->ID) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('error' => '未登录'));
        exit;
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array(
        'time'    => date('Y-m-d H:i:s'),
        'version' => $GLOBALS['option']['ZC_BLOG_PRODUCT_FULL'],
        'memory'  => memory_get_usage(),
    ));
    exit;
}
```

## 注意事项

- 触发位置在 `zb_system/cmd.php` 的 `case 'ajax'` 分支，回调接收到的第一个参数是 `GetVars('src', 'GET')` 的值，插件应按 `src` 区分多个接口；
- 当 `act=ajax` 或请求头 `X-Requested-With` 为 `XMLHttpRequest` 时 cmd.php 进入 Ajax 模式；`ajax` 动作的默认权限级别为访客级，核心不会替插件校验用户权限，必须自行判断；
- 回调接管了本次请求的输出，输出完成后应主动结束脚本；
- 与 `Filter_Plugin_Misc_Begin` 的区别在于：本接口位于 cmd.php 的 Ajax 流程，适合轻量级的数据交互，而非完整页面输出。
