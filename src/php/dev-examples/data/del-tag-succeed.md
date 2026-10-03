---
title: Z-BlogPHP 标签删除后处理扩展
description: 通过 Filter_Plugin_DelTag_Succeed 接口在 Z-BlogPHP 标签删除成功后写日志、清理自定义关联缓存，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelTag_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 标签删除后处理扩展

通过 `Filter_Plugin_DelTag_Succeed` 接口，可以在 Z-BlogPHP 标签删除成功之后执行自定义逻辑。该接口在 `DelTag()` 函数内触发，此时标签已从数据库删除、导航栏项已移除、标签模块也已重建，适合做删除留痕与关联缓存清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelTag_Succeed` | `&$tag` | 标签删除成功的接口 |

## 完整案例

下例在标签删除成功后记录一条日志，包含被删标签的 ID、名称与类型，便于追溯标签变化：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelTag_Succeed', 'demoAPP_DelTag_Succeed');
}

function demoAPP_DelTag_Succeed(&$tag)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-tag.log';
    $log = date('Y-m-d H:i:s') . ' 标签删除 #' . $tag->ID
        . ' 名称=' . $tag->Name . ' 类型=' . $tag->Type
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelTag()` 中、`$tag->Del()`、导航栏项移除与 `tags` 模块重建完成之后；
- 触发时标签已从数据库删除，但内存中的 `$tag` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 删除标签后，原引用该标签的文章的 `Tag` 字段仍保留该标签 ID 字符串，系统不做自动清理，若插件维护了标签与内容的关联表，应在本接口内自行清理；
- 删除流程没有对应的 Core 前置接口，保存侧对应接口为 `Filter_Plugin_PostTag_Succeed`，两者分别位于删除与保存两条独立流程；
- 注意触发时机在模块重建之后，若在回调内再调用 `$zbp->AddBuildModule('tags')` 会造成重复重建，没有必要。
