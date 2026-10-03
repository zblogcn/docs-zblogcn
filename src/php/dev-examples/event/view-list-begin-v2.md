---
title: Z-BlogPHP 列表页输出接管接口案例
description: 通过 Filter_Plugin_ViewList_Begin_V2 接口在 Z-BlogPHP 列表页渲染开始时接管输出，实现特定列表的自定义页面。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewList_Begin_V2
  - 插件接口
  - 列表页
  - 视图渲染
---

# 列表页输出接管

`Filter_Plugin_ViewList_Begin_V2` 挂载在列表页渲染函数 `ViewList()` 的最前端，早于旧版的 `Filter_Plugin_ViewList_Begin` 接口执行。系统在进入列表查询与模板渲染之前先把第一参数交给本接口的回调，回调声明接管后整个列表页的输出由插件返回值决定，适合为特定列表返回完全自定义的页面内容。第 2 版接口与旧版的区别是只传入一个数组型的首参。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewList_Begin_V2` | `&$array` | 定义列表输出接口（第 2 版，只传一个 $array） |

## 完整案例

下例为指定分类的列表页返回自定义内容，其余列表维持系统默认渲染：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewList_Begin_V2', 'demoAPP_ViewList_Begin_V2');
}

function demoAPP_ViewList_Begin_V2($page)
{
    global $zbp;
    // $page 为 ViewList 的第一参数，可能是页码或路由传入的参数数组
    $cateId = is_array($page) ? (isset($page['cate']) ? $page['cate'] : null) : null;
    if ($cateId == 2 && $zbp->categorys[2]->ID == 2) {
        // 声明接管，返回值将直接作为 ViewList 的输出
        $GLOBALS['hooks']['Filter_Plugin_ViewList_Begin_V2']['demoAPP_ViewList_Begin_V2'] = PLUGIN_EXITSIGNAL_RETURN;
        return '<!DOCTYPE html><html><head><meta charset="utf-8"><title>自定义列表页</title></head>'
            . '<body><h1>这是由 demoAPP 插件渲染的自定义列表页</h1></body></html>';
    }
    // 不接管时显式清除信号，交回系统默认流程
    $GLOBALS['hooks']['Filter_Plugin_ViewList_Begin_V2']['demoAPP_ViewList_Begin_V2'] = PLUGIN_EXITSIGNAL_NONE;
    return null;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_route.php` 的 `ViewList()` 函数开头，首页、分类、标签、日期、作者等所有列表路由的渲染都会经过此处，调用频繁；
- 接口清单声明的参数为 `&$array`，实际调用时传入 `ViewList` 的第一参数：按新式路由调用时它是一个包含 `page`、`cate`、`auth`、`date`、`tags` 等键的数组，传统调用时则是页码，回调内应做类型判断；
- 回调返回值只有在信号为 `PLUGIN_EXITSIGNAL_RETURN` 时才会成为 `ViewList()` 的输出（正常情况下应为渲染后的完整页面 HTML），案例采用在回调内动态设置信号的方式，也可在回调中直接 `echo` 并 `exit`；
- 接管后分类权限校验、文章列表查询、分页条与模块渲染等系统流程都不会执行，插件需自行完成数据查询与页面输出；
- 若只想修改列表查询而非替换整页，应改用 `Filter_Plugin_ViewList_Core` 或 `Filter_Plugin_LargeData_Article` 等查询类接口，避免在本接口中重复实现列表渲染。
