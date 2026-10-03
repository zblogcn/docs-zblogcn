---
title: Z-BlogPHP API 分页信息扩展
description: 通过 Filter_Plugin_API_Get_Pagination_Info 接口在 Z-BlogPHP 的 API 分页信息输出前追加自定义字段的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Get_Pagination_Info
  - 插件接口
  - API
  - 分页信息
---

# API 分页信息扩展

通过 `Filter_Plugin_API_Get_Pagination_Info` 接口，可以在 Z-BlogPHP 的 API 分页信息输出前（`ApiGetPagebarInfo()` 返回前）追加或修改分页字段，适用于为客户端补充自定义分页数据的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Get_Pagination_Info` | `&$info, &$pagebar` | API 获取分页信息，`$info` 为即将输出的分页信息数组，`$pagebar` 为分页对象 |

## 完整案例

下例在分页信息中追加每页条数与站点名称两个字段：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Get_Pagination_Info', 'demoAPP_API_Get_Pagination_Info');
}

function demoAPP_API_Get_Pagination_Info(&$info, &$pagebar)
{
    global $zbp;
    // $info 中已包含 AllCount、PerPageCount、PageAll、PageNow 等字段
    $info['SiteName'] = $zbp->name;
    $info['HasMore'] = ($pagebar->PageNow < $pagebar->PageAll);
}
```

## 注意事项

- 两个参数均需在回调签名中使用引用传递（`&$info, &$pagebar`），对 `$info` 的修改会直接出现在 API 响应的 `pagebar` 数据中；
- 该接口在 `ApiGetPagebarInfo()` 组装分页信息时触发，此时系统已写入 `AllCount`、`CurrentCount`、`PerPageCount`、`PageAll`、`PageNow`、`PageCurrent`、`PageFirst`、`PageLast`、`PagePrevious`、`PageNext` 等字段，回调可读取也可覆盖；
- `$pagebar` 为 `Pagebar` 对象（来自查询时的 `$option['pagebar']`）， `$option` 为 `null` 时系统直接返回空对象，不会触发本接口；
- 追加字段时注意命名前缀（如 `demoapp_`），避免与系统已有或未来新增的分页字段冲突。
