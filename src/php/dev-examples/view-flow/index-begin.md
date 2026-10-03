---
title: Z-BlogPHP 前台首页入口开始监听扩展
description: 通过 Filter_Plugin_Index_Begin 接口在 Z-BlogPHP 前台 index.php 启动后、路由分发前执行访问统计、维护页跳转等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Index_Begin
  - 插件接口
  - 前台流程监听
---

# 前台首页入口开始监听扩展

通过 `Filter_Plugin_Index_Begin` 接口，可以在 Z-BlogPHP 前台根目录 `index.php` 启动后、路由分发前执行自定义逻辑，适用于访问统计、维护页跳转、访客拦截等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Index_Begin` | 无 | 前台 `index.php` 启动后触发，在路由分发与实际渲染之前 |

## 完整案例

下例在网站维护期间，将所有前台访问者重定向到维护公告页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Index_Begin', 'demoAPP_Index_Begin');
}

function demoAPP_Index_Begin()
{
    global $zbp;
    // 维护开关，可改为读取插件配置
    $maintaining = true;
    if ($maintaining) {
        header('Location: ' . $zbp->host . 'maintain.html');
        die();
    }
}
```

## 注意事项

- 接口没有参数，回调函数可通过输出内容并 `die()` 的方式拦截后续渲染；
- 该接口只在前台根目录 `index.php` 入口触发，不作用于后台管理页、`feed.php`、`search.php` 等其他入口；
- 触发时路由尚未分发，`$zbp->action` 等与具体页面相关的上下文可能尚未就绪，适合做全局性的前置判断；
- 触发时页面 HTML 尚未输出，适合执行跳转、输出错误等会终止后续流程的操作。
