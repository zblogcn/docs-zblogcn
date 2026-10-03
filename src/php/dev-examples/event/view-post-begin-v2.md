---
title: Z-BlogPHP 文章页输出接管接口案例
description: 通过 Filter_Plugin_ViewPost_Begin_V2 接口在 Z-BlogPHP 文章页渲染开始时接管输出，实现特定文章的自定义页面。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewPost_Begin_V2
  - 插件接口
  - 文章页
  - 视图渲染
---

# 文章页输出接管

`Filter_Plugin_ViewPost_Begin_V2` 挂载在文章页渲染函数 `ViewPost()` 的最前端，早于旧版的 `Filter_Plugin_ViewPost_Begin` 接口执行。系统在进入文章查询与模板渲染之前先把第一参数交给本接口的回调，回调声明接管后整个文章页的输出由插件返回值决定，适合为特定文章返回完全自定义的页面内容。第 2 版接口与旧版的区别是只传入一个数组型的首参。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_Begin_V2` | `&$array` | 定义 POST 显示输出 begin 接口（第 2 版，只传入一个 $array） |

## 完整案例

下例为指定 ID 的文章返回自定义页面内容，其余文章维持系统默认渲染：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewPost_Begin_V2', 'demoAPP_ViewPost_Begin_V2');
}

function demoAPP_ViewPost_Begin_V2($id)
{
    // $id 为 ViewPost 的第一参数，可能是文章 ID、别名或路由传入的数组
    $postId = is_array($id) ? (isset($id['id']) ? $id['id'] : null) : $id;
    if ((int) $postId === 1) {
        // 声明接管，返回值将直接作为 ViewPost 的输出
        $GLOBALS['hooks']['Filter_Plugin_ViewPost_Begin_V2']['demoAPP_ViewPost_Begin_V2'] = PLUGIN_EXITSIGNAL_RETURN;
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>自定义文章页</title></head>'
            . '<body><h1>这是由 demoAPP 插件渲染的自定义文章页</h1></body></html>';
    }
    // 不接管时显式清除信号，交回系统默认流程
    $GLOBALS['hooks']['Filter_Plugin_ViewPost_Begin_V2']['demoAPP_ViewPost_Begin_V2'] = PLUGIN_EXITSIGNAL_NONE;
    return null;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_route.php` 的 `ViewPost()` 函数开头，每次文章页渲染都会执行，早于文章合法性校验、浏览计数与模板渲染；
- 接口清单声明的参数为 `&$array`，实际调用时传入 `ViewPost` 的第一参数：按新式路由调用时它是一个包含 `id`、`alias`、`_route` 等键的数组，传统调用时则是文章 ID 或别名字符串，回调内应做类型判断；
- 回调返回值只有在信号为 `PLUGIN_EXITSIGNAL_RETURN` 时才会成为 `ViewPost()` 的输出（正常情况下应为渲染后的完整页面 HTML），因此案例采用在回调内动态设置信号的方式；也可以在回调中直接 `echo` 并 `exit` 实现同等效果；
- 接管后文章权限校验、浏览计数、评论分页等系统流程都不会执行，插件需自行处理访问控制，避免把受限内容输出给未授权访客；
- 接管失败或返回 `null` 且信号被误设为 `RETURN` 时，文章页会输出空内容，调试这类问题应优先检查 `$GLOBALS['hooks']` 中的信号值。
