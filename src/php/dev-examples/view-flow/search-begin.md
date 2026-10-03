---
title: Z-BlogPHP 搜索入口开始监听扩展
description: 通过 Filter_Plugin_Search_Begin 接口在 Z-BlogPHP 前台 search.php 启动后执行搜索开关控制、关键词预处理等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Search_Begin
  - 插件接口
  - 前台流程监听
  - 搜索
---

# 搜索入口开始监听扩展

通过 `Filter_Plugin_Search_Begin` 接口，可以在 Z-BlogPHP 前台根目录 `search.php` 启动后执行自定义逻辑，适用于搜索开关控制、搜索频率限制等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Search_Begin` | 无 | 前台 `search.php` 启动后触发，在搜索查询执行之前 |

## 完整案例

下例对搜索请求做简单的频率限制：同一 IP 在 5 秒内重复搜索时提示稍后再试：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Search_Begin', 'demoAPP_Search_Begin');
}

function demoAPP_Search_Begin()
{
    global $zbp;
    $ip = GetGuestIP();
    $file = $zbp->usersdir . 'plugin/demoAPP/search-lock-' . md5($ip);
    if (file_exists($file) && (time() - filemtime($file)) < 5) {
        $zbp->ShowError('搜索过于频繁，请稍后再试');
        die();
    }
    touch($file);
}
```

## 注意事项

- 接口没有参数，回调函数可通过输出错误并 `die()` 的方式拦截后续查询；
- 该接口只在前台根目录 `search.php` 入口触发，不作用于 `index.php`、`feed.php` 等其他入口；
- 触发时搜索查询尚未执行，适合做拦截、预处理等前置操作；
- 频率限制类逻辑注意清理过期的临时文件，避免目录中积累大量文件。
