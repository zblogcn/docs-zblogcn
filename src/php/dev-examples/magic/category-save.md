---
title: Z-BlogPHP 分类保存联动接口
description: 通过 Filter_Plugin_Category_Save 接口在 Z-BlogPHP 分类保存入库前执行联动处理，如自动生成别名、校验字段，或按需拦截保存操作。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Category_Save
  - Category_Save
  - 分类保存
  - 插件接口
  - 魔术方法
---

# 分类保存联动接口

在 Z-BlogPHP 中调用分类对象的 `Save()` 方法时（后台新建、编辑分类最终都会走到这里），会在数据入库前触发 `Filter_Plugin_Category_Save` 接口，适合做保存前的字段补全与联动处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Category_Save` | `&$category` | Category 类的 Save 方法接口 |

## 完整案例

下例在保存分类时为没有别名的分类自动生成一个默认别名：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Category_Save', 'demoAPP_Category_Save');
}

function demoAPP_Category_Save(&$category)
{
    if ($category->Alias == '') {
        $category->Alias = 'cate-' . date('YmdHis');
    }
}
```

## 注意事项

- 触发时机在数据入库之前，且系统在调用本接口前已按父级分类重算过 `RootID`；默认注册方式下回调返回值被忽略，回调中修改 `$category` 的属性会随本次保存一起写入数据库。
- 若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值将直接作为 `Save()` 的返回值并跳过数据库写入，可用于有条件地阻止保存，此时应自行向用户说明原因。
- 自动生成别名时注意与既有别名查重，避免生成重复别名导致地址冲突。
- 回调中不要对当前对象再次调用 `Save()`，避免递归。
