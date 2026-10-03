---
title: Z-BlogPHP 后台管理页开始监听扩展
description: 通过 Filter_Plugin_Admin_Begin 接口在 Z-BlogPHP 后台管理页启动时执行权限判断、请求拦截等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Begin
  - 插件接口
  - 后台流程监听
---

# 后台管理页开始监听扩展

通过 `Filter_Plugin_Admin_Begin` 接口，可以在 Z-BlogPHP 后台管理页（`zb_system/admin/index.php`，即 `cmd.php?act=...` 指向的各类管理页）启动时执行自定义逻辑，适用于权限校验、请求拦截、访问日志等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Begin` | 无 | 后台管理页启动时触发，在页面实际内容渲染之前 |

## 完整案例

下例在文章管理页访问时检查用户是否拥有 `ArticleAll` 权限，无权限则跳转到错误页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_Begin', 'demoAPP_Admin_Begin');
}

function demoAPP_Admin_Begin()
{
    global $zbp;
    // $zbp->action 是当前后台操作（如 ArticleMng、CategoryMng、admin 等）
    if ($zbp->action == 'ArticleMng' && !$zbp->CheckRights('ArticleAll')) {
        $zbp->ShowError(6);
        die();
    }
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容或执行逻辑后 `die()` 拦截；系统已在进入本接口前完成了通用权限校验（`CheckRights($zbp->action)`），本接口用于更细粒度的自定义控制；
- 该接口只作用于 `zb_system/admin/index.php` 入口下的管理页，不作用于各编辑页（如 `edit.php`、`category_edit.php` 等）和 `cmd.php` 提交的 `act` 操作；
- 如需拦截 `cmd.php` 的表单提交操作，应使用对应的 `Filter_Plugin_Cmd_Begin` 接口；
- 触发时页面 HTML 尚未输出，适合执行跳转（`Redirect`）、输出错误（`ShowError`）等会终止后续渲染的操作。
