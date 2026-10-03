---
title: Z-BlogPHP 搜索查询开始监听扩展
description: 通过 Filter_Plugin_ViewSearch_Begin 接口在 Z-BlogPHP 的 ViewSearch() 搜索页查询开始时执行关键词校验、前置统计等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewSearch_Begin
  - 插件接口
  - 前台流程监听
  - 搜索
---

# 搜索查询开始监听扩展

通过 `Filter_Plugin_ViewSearch_Begin` 接口，可以在 Z-BlogPHP 的 `ViewSearch()` 函数搜索页查询开始时执行自定义逻辑，适用于关键词校验、搜索前置统计等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewSearch_Begin` | 无 | `ViewSearch()` 搜索页查询开始时触发 |

## 完整案例

下例在搜索查询开始前校验关键词长度，过短时直接提示错误：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewSearch_Begin', 'demoAPP_ViewSearch_Begin');
}

function demoAPP_ViewSearch_Begin()
{
    global $zbp;
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    if ($q != '' && mb_strlen($q, 'UTF-8') < 2) {
        $zbp->ShowError('搜索关键词至少为 2 个字符');
        die();
    }
}
```

## 注意事项

- 接口没有参数，回调函数可通过输出错误并 `die()` 的方式拦截后续查询；
- 该接口只在 `search.php` 入口触发，不作用于 `index.php`、`feed.php` 等其他入口；
- 触发时搜索查询条件尚未组装，如需修改查询条件应使用 `Filter_Plugin_ViewSearch_Core` 接口；
- 搜索关键词一般通过 `$_GET['q']` 获取，读取后应先做过滤与校验再使用。
