---
title: Z-BlogPHP 搜索入口结束监听扩展
description: 通过 Filter_Plugin_Search_End 接口在 Z-BlogPHP 前台 search.php 渲染完成后执行搜索关键词记录、搜索统计等收尾逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Search_End
  - 插件接口
  - 前台流程监听
  - 搜索
---

# 搜索入口结束监听扩展

通过 `Filter_Plugin_Search_End` 接口，可以在 Z-BlogPHP 前台根目录 `search.php` 渲染完成后执行自定义收尾逻辑，适用于搜索关键词记录、搜索统计等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Search_End` | 无 | 前台 `search.php` 渲染完成后触发 |

## 完整案例

下例在每次搜索结束后，把搜索关键词记录到日志文件，便于分析访客搜索习惯：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Search_End', 'demoAPP_Search_End');
}

function demoAPP_Search_End()
{
    global $zbp;
    $q = isset($_GET['q']) ? trim($_GET['q']) : '';
    if ($q != '') {
        $log = date('Y-m-d H:i:s') . ' ' . GetGuestIP() . ' ' . $q . PHP_EOL;
        $file = $zbp->usersdir . 'plugin/demoAPP/keywords.log';
        file_put_contents($file, $log, FILE_APPEND);
    }
}
```

## 注意事项

- 接口没有参数，回调函数中应避免再输出页面内容，适合做日志、统计等收尾工作；
- 该接口只在前台根目录 `search.php` 入口触发，不作用于 `index.php`、`feed.php` 等其他入口；
- 触发时搜索页已渲染完成，不宜在此执行跳转或修改输出；
- 记录关键词时注意控制日志文件大小，并避免记录敏感信息。
