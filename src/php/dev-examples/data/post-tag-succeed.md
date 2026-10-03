---
title: Z-BlogPHP 标签保存后处理扩展
description: 通过 Filter_Plugin_PostTag_Succeed 接口在 Z-BlogPHP 标签保存成功后写变更日志、同步自定义缓存，实现标签后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostTag_Succeed
  - 插件接口
  - 数据写入
  - 保存后处理
---

# 标签保存后处理扩展

通过 `Filter_Plugin_PostTag_Succeed` 接口，可以在 Z-BlogPHP 标签保存成功之后执行自定义逻辑。该接口在 `PostTag()` 函数的末尾触发，此时标签已写入数据库、标签模块也已重建，适合做变更日志、缓存同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostTag_Succeed` | `&$tag` | 标签编辑成功的接口 |

## 完整案例

下例在标签保存成功后记录一条变更日志，并把全部标签名缓存到自定义文件供前端模板读取：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostTag_Succeed', 'demoAPP_PostTag_Succeed');
}

function demoAPP_PostTag_Succeed(&$tag)
{
    global $zbp;

    // 保存成功后写变更日志
    $file = $zbp->usersdir . 'plugin/demoAPP/tag.log';
    $log = date('Y-m-d H:i:s') . ' 标签保存 #' . $tag->ID . ' ' . $tag->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);

    // 重建自定义标签名缓存文件
    $tags = $zbp->GetTagList('*', array(array('=', 'tag_Type', $tag->Type)), '', null, '');
    $names = array();
    foreach ($tags as $t) {
        $names[] = $t->Name;
    }
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/tag-cache.txt', implode(',', $names));
}
```

## 注意事项

- 触发位置：在 `PostTag()` 末尾、`$tag->Save()`、导航栏处理与 `tags` 模块重建完成之后；
- 除在标签管理界面保存标签外，保存文章时系统自动创建新标签也会触发本接口，因此在文章提交高频的站点要注意回调内逻辑的开销；
- 此时 `$tag->ID` 已可用：新建标签在此前 ID 为 0，进入本接口时已拿到数据库分配的 ID；
- 回调中的对象参数可以声明为 `&$tag` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$tag->Save()`；
- 本接口与 `Filter_Plugin_PostTag_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；删除标签请使用 `Filter_Plugin_DelTag_Succeed`。
