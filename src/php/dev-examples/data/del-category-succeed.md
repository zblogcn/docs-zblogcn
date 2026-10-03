---
title: Z-BlogPHP 分类删除后处理扩展
description: 通过 Filter_Plugin_DelCategory_Succeed 接口在 Z-BlogPHP 分类删除成功后写日志、清理自定义关联数据，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelCategory_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 分类删除后处理扩展

通过 `Filter_Plugin_DelCategory_Succeed` 接口，可以在 Z-BlogPHP 分类删除成功之后执行自定义逻辑。该接口在 `DelCategory()` 函数内触发，此时分类下的文章已被批量处理、分类本身已从数据库删除、分类列表已重新加载、网站目录模块也已重建，适合做删除留痕与关联数据清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelCategory_Succeed` | `&$cate` | 分类删除成功的接口 |

## 完整案例

下例在分类删除成功后记录一条日志，包含被删分类的 ID、名称与父级，便于追溯分类结构变化：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelCategory_Succeed', 'demoAPP_DelCategory_Succeed');
}

function demoAPP_DelCategory_Succeed(&$cate)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-category.log';
    $log = date('Y-m-d H:i:s') . ' 分类删除 #' . $cate->ID
        . ' 名称=' . $cate->Name . ' 父级=' . $cate->ParentID
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelCategory()` 中、`DelCategory_Articles`（分类下文章的删除或转移）与 `$cate->Del()`、分类列表重载、`catalog` 模块重建、导航栏项移除全部完成之后；
- 存在子分类的分类无法删除（系统会直接报错返回），因此能触发本接口的都是末级分类；
- 触发时分类已从数据库删除，但内存中的 `$cate` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 删除流程没有对应的 Core 前置接口，保存侧对应接口为 `Filter_Plugin_PostCategory_Succeed`，两者分别位于删除与保存两条独立流程；
- 分类下文章的具体处置方式（删除还是转移）由系统配置项决定，回调内不应假设文章数据仍归属该分类。
