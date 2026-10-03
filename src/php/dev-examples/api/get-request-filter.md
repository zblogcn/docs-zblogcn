---
title: Z-BlogPHP API 查询条件过滤扩展
description: 通过 Filter_Plugin_API_Get_Request_Filter 接口在 Z-BlogPHP 的 API 列表查询条件生成后调整 limit 与 order 的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_API_Get_Request_Filter
  - 插件接口
  - API
  - 查询条件
---

# API 查询条件过滤扩展

通过 `Filter_Plugin_API_Get_Request_Filter` 接口，可以在 Z-BlogPHP 的 API 列表查询条件生成后（`ApiGetRequestFilter()` 返回前）调整查询的排序与分页限制，适用于统一修改各 API 列表端点默认排序、限制单次返回条数等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Get_Request_Filter` | `&$condition` | API 获取约束过滤条件，`$condition` 含 `limit`、`order`、`option` 三个键 |

## 完整案例

下例为所有走 `ApiGetRequestFilter` 的 API 列表端点设置默认按更新时间倒序，并把每页条数限制在 20 条以内：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_API_Get_Request_Filter', 'demoAPP_API_Get_Request_Filter');
}

function demoAPP_API_Get_Request_Filter(&$condition)
{
    // 默认排序：请求未指定 sortby 时 $condition['order'] 为 null，此处统一设为按更新时间倒序
    if ($condition['order'] === null) {
        $condition['order'] = array('log_UpdateTime' => 'DESC');
    }
    // 限制每页条数：$condition['limit'] 为 array(偏移量, 条数)
    if (is_array($condition['limit']) && $condition['limit'][1] > 20) {
        $condition['limit'][1] = 20;
    }
}
```

## 注意事项

- 参数 `$condition` 需在回调签名中使用引用传递 `&$condition`，修改后才会影响最终的查询；
- `$condition` 数组的 `limit` 键为 `array(偏移量, 条数)`，`order` 键为 `array(数据表字段 => 'ASC' 或 'DESC')`（请求未指定有效排序时为 `null`），`option` 键内含 `Pagebar` 分页对象；
- 该接口在各个 API 模块调用 `ApiGetRequestFilter()` 生成查询条件时触发（如 `mod=post&act=list`），位于查询执行之前，修改结果直接作用于随后的数据库查询；
- 如需修改某个具体列表端点的查询内容（如追加过滤条件），对文章列表应使用 `Filter_Plugin_API_Post_List_Core` 接口。
