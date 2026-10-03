---
title: Z-BlogPHP 页面保存后处理扩展
description: 通过 Filter_Plugin_PostPage_Succeed 接口在 Z-BlogPHP 页面保存成功后重建站点地图、写日志，实现页面后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostPage_Succeed
  - 插件接口
  - 数据写入
  - 保存后处理
---

# 页面保存后处理扩展

通过 `Filter_Plugin_PostPage_Succeed` 接口，可以在 Z-BlogPHP 页面保存成功之后执行自定义逻辑。该接口在 `PostPage()` 函数的末尾触发，此时页面已写入数据库、作者计数与评论模块重建均已完成，适合做静态化通知、站点地图更新等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostPage_Succeed` | `&$article` | 页面编辑成功的接口 |

## 完整案例

下例在页面保存成功后，把该页面的 ID 与地址追加写入自定义的站点地图缓存文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostPage_Succeed', 'demoAPP_PostPage_Succeed');
}

function demoAPP_PostPage_Succeed(&$article)
{
    global $zbp;

    // 保存成功后更新自定义站点地图文件
    $line = $zbp->host . 'index.php?id=' . $article->ID . ' ' . $article->Title . PHP_EOL;
    $file = $zbp->usersdir . 'plugin/demoAPP/page-sitemap.txt';

    // 简单处理：读取旧内容并按 ID 去重后重写
    $lines = is_file($file) ? file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : array();
    $new = array();
    foreach ($lines as $l) {
        if (strpos($l, 'index.php?id=' . $article->ID . ' ') !== 0) {
            $new[] = $l;
        }
    }
    $new[] = $line;
    file_put_contents($file, implode(PHP_EOL, $new) . PHP_EOL);
}
```

## 注意事项

- 触发位置：在 `PostPage()` 末尾、`$article->Save()`、作者计数与评论模块重建完成之后；
- 页面与文章共用 Post 表，此接口的参数名为 `$article`，其 `Type` 属性为 `ZC_POST_TYPE_PAGE`；此时 `$article->ID` 已是确定值，可直接用于关联操作；
- 回调中的对象参数可以声明为 `&$article` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$article->Save()`；
- 本接口与 `Filter_Plugin_PostPage_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；
- 导航栏的新增或移除（`AddNavbar` 表单项）在本接口之前已由系统处理，若需追加自定义导航逻辑，可在此读取导航数据后再加工。
