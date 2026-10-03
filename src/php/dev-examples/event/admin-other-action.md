---
title: Z-BlogPHP 后台自定义动作分发接口案例
description: 通过 Filter_Plugin_Admin_Other_Action 接口在 Z-BlogPHP 后台实现自定义 act 动作页面，扩展后台管理功能。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Other_Action
  - 插件接口
  - 后台管理
  - 自定义页面
---

# 后台自定义动作分发

`Filter_Plugin_Admin_Other_Action` 挂载在后台入口 `admin/index.php` 处理 `$zbp->action` 的 `switch` 语句的 `default` 分支中：当请求的后台动作不属于系统内置动作（`ArticleMng`、`PageMng`、`CategoryMng`、`CommentMng`、`MemberMng`、`UploadMng`、`TagMng`、`PluginMng`、`ThemeMng`、`ModuleMng`、`SettingMng`、`admin`）时触发，插件可以借此实现自己的后台动作页面。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Other_Action` | 无 | 后台管理页拦截后台管理请求实现自己的 Action |

## 完整案例

下例实现一个 `act=demoAPP_Panel` 的自定义后台页面：注册动作权限、在回调中认领动作并把管理函数指向插件自己的渲染函数：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    // 注册自定义动作的权限门槛，等级数字越小权限越高，1 表示管理员可用
    global $zbp;
    $zbp->actions['demoAPP_Panel'] = 1;
    Add_Filter_Plugin('Filter_Plugin_Admin_Other_Action', 'demoAPP_Admin_Other_Action');
}

function demoAPP_Admin_Other_Action($action, &$admin_function)
{
    global $zbp;
    // 只认领自己的动作，其余动作交回其他回调或系统处理
    if ($action != 'demoAPP_Panel') {
        return;
    }
    $admin_function = 'demoAPP_Panel';
    // 返回 break 中断后续回调，防止其他插件覆盖本动作
    return PLUGIN_EXITSIGNAL_BREAK;
}

function demoAPP_Panel()
{
    // 自定义后台页面内容，输出在后台主区域 divMain 中
    echo '<h2>演示面板</h2>';
    echo '<p>这是由 demoAPP 插件提供的自定义后台页面。</p>';
}
```

## 注意事项

- 触发位置在 `zb_system/admin/index.php` 的 `switch ($zbp->action)` 的 `default` 分支，只有未被系统内置动作命中的 `act` 才会走到这里；
- 回调收到两个参数：当前动作名 `$zbp->action` 与尚未赋值的 `$admin_function`；第二个参数按引用声明（`&$admin_function`），插件把它设为自己的函数名后，页面主区域会执行 `$admin_function()` 渲染内容；
- 回调返回值会直接作为执行信号，返回 `PLUGIN_EXITSIGNAL_BREAK` 或 `PLUGIN_EXITSIGNAL_RETURN`（即字符串 `break`、`return`）可中断后续插件回调；
- 后台入口在进入分发前会先执行 `$zbp->CheckRights($zbp->action)`，未注册的动作默认无权限会被拒绝，因此插件必须在 `ActivePlugin_demoAPP()` 中先通过 `$zbp->actions` 注册动作与等级门槛，回调内也可再做更细的权限校验；
- 自定义管理函数应在插件主文件中定义（后台加载时插件代码已被引入），函数输出位于 `admin_header.php`、`admin_top.php` 与 `admin_footer.php` 之间，可直接使用后台的样式与全局 `$zbp`。
