---
title: Z-BlogPHP 分类保存后处理扩展
description: 通过 Filter_Plugin_PostCategory_Succeed 接口在 Z-BlogPHP 分类保存成功后写变更日志、重建自定义缓存，实现分类后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostCategory_Succeed
  - 插件接口
  - 数据写入
  - 保存后处理
---

# 分类保存后处理扩展

通过 `Filter_Plugin_PostCategory_Succeed` 接口，可以在 Z-BlogPHP 分类保存成功之后执行自定义逻辑。该接口在 `PostCategory()` 函数的末尾触发，此时分类已写入数据库、分类计数已更新、网站目录模块也已重建，适合做变更日志、缓存同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostCategory_Succeed` | `&$cate` | 分类编辑成功的接口 |

## 完整案例

下例在分类保存成功后记录一条变更日志，包含分类 ID、名称与层级路径，便于追踪分类结构变化：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostCategory_Succeed', 'demoAPP_PostCategory_Succeed');
}

function demoAPP_PostCategory_Succeed(&$cate)
{
    global $zbp;

    // 保存成功后写变更日志
    $file = $zbp->usersdir . 'plugin/demoAPP/category.log';
    $log = date('Y-m-d H:i:s') . ' 分类保存 #' . $cate->ID
        . ' 名称=' . $cate->Name . ' 父级=' . $cate->ParentID
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostCategory()` 末尾、`$cate->Save()`、分类文章计数（非大数据模式）与 `catalog` 模块重建完成之后；
- 此时 `$cate->ID` 已可用：新建分类在此前 ID 为 0，进入本接口时已拿到数据库分配的 ID；
- 回调中的对象参数可以声明为 `&$cate` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$cate->Save()`；
- 本接口与 `Filter_Plugin_PostCategory_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；
- 导航栏项的添加或移除（`AddNavbar` 表单项）在本接口之前已由系统处理；删除分类没有对应的 Post 系接口，删除后的处理请使用 `Filter_Plugin_DelCategory_Succeed`。
