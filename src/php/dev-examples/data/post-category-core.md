---
title: Z-BlogPHP 分类提交前校验扩展
description: 通过 Filter_Plugin_PostCategory_Core 接口在 Z-BlogPHP 分类数据入库前规范别名、校验名称，实现分类提交数据预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostCategory_Core
  - 插件接口
  - 数据写入
  - 分类编辑
---

# 分类提交前校验扩展

通过 `Filter_Plugin_PostCategory_Core` 接口，可以在 Z-BlogPHP 保存分类之前对提交数据做最后处理。该接口在 `PostCategory()` 函数内触发，此时表单数据已读入 `$cate` 对象并完成了上级分类层级刷新，但尚未执行系统过滤与数据库写入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostCategory_Core` | `&$cate` | 分类编辑的核心接口 |

## 完整案例

下例在分类保存前把别名统一转为小写并去除空白，同时在别名为空时根据名称自动生成：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostCategory_Core', 'demoAPP_PostCategory_Core');
}

function demoAPP_PostCategory_Core(&$cate)
{
    // 别名规范化为小写、去掉首尾空白
    $cate->Alias = strtolower(trim($cate->Alias));

    // 别名为空时用名称拼音风格占位（此处简化为去掉空格的名称）
    if ($cate->Alias == '' && $cate->Name != '') {
        $cate->Alias = str_replace(' ', '-', trim($cate->Name));
    }

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostCategory_Core #' . $cate->ID . ' ' . $cate->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostCategory()` 中、`FilterMeta` 与分类层级刷新之后、`FilterCategory` 与 `$cate->Save()` 之前，修改会随本次保存一起入库；
- 参数按引用传递，回调函数签名必须写成 `&$cate`，否则对分类对象的修改不会生效；
- 本接口与 `Filter_Plugin_PostCategory_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存与分类模块重建完成后触发；
- 在回调内调用 `ShowError` 可以终止保存流程，适合做分类名称、层级深度等业务校验；
- 删除分类没有对应的 Core 接口，删除后的处理请使用 `Filter_Plugin_DelCategory_Succeed`。
