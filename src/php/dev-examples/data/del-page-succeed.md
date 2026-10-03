---
title: Z-BlogPHP 页面删除后处理扩展
description: 通过 Filter_Plugin_DelPage_Succeed 接口在 Z-BlogPHP 页面删除成功后写日志、清理自定义站点地图条目，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelPage_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 页面删除后处理扩展

通过 `Filter_Plugin_DelPage_Succeed` 接口，可以在 Z-BlogPHP 页面删除成功之后执行自定义逻辑。该接口在 `DelPage()` 函数内触发，此时页面已从数据库删除、评论数据已清理、作者计数已修正、导航栏项已移除，适合做删除留痕与关联数据清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelPage_Succeed` | `&$article` | 页面删除成功的接口 |

## 完整案例

下例在页面删除成功后记录一条日志，并从自定义站点地图文件中移除对应条目：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelPage_Succeed', 'demoAPP_DelPage_Succeed');
}

function demoAPP_DelPage_Succeed(&$article)
{
    global $zbp;

    // 写删除日志
    $file = $zbp->usersdir . 'plugin/demoAPP/del-page.log';
    $log = date('Y-m-d H:i:s') . ' 页面删除 #' . $article->ID
        . ' ' . $article->Title . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);

    // 从自定义站点地图文件中移除该页面条目
    $map = $zbp->usersdir . 'plugin/demoAPP/page-sitemap.txt';
    if (is_file($map)) {
        $lines = file($map, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $new = array();
        foreach ($lines as $l) {
            if (strpos($l, 'index.php?id=' . $article->ID . ' ') !== 0) {
                $new[] = $l;
            }
        }
        file_put_contents($map, implode(PHP_EOL, $new) . PHP_EOL);
    }
}
```

## 注意事项

- 触发位置：在 `DelPage()` 中、`$article->Del()`、评论数据清理、作者计数修正与导航栏项移除完成之后；
- 除单篇删除外，后台批量删除页面（`Include_BatchPost_Page` 内逐篇处理）同样会触发本接口；
- 页面与文章共用 Post 表，此接口的参数名为 `$article`，其 `Type` 属性为 `ZC_POST_TYPE_PAGE`；触发时页面已从数据库删除，但内存中的对象属性仍可读取，适合做删除日志；
- 删除流程没有对应的 Core 前置接口，需要在删除前备份数据应使用通用的 `Filter_Plugin_DelPost_Core`；
- 本接口与 `Filter_Plugin_PostPage_Succeed` 分别对应页面的删除与保存两条独立流程，无先后关系。
