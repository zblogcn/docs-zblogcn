---
title: Z-BlogPHP 文章下一篇自定义接口
description: 通过 Filter_Plugin_Post_Next 接口在 Z-BlogPHP 读取文章 Next 属性时自定义下一篇逻辑，如同分类内取下一篇，返回空则走系统默认。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Next
  - Post_Next
  - 下一篇
  - 插件接口
  - 魔术方法
---

# 文章下一篇自定义接口

在 Z-BlogPHP 中读取文章对象的 `Next` 属性（即下一篇）时会触发 `Filter_Plugin_Post_Next` 接口，回调返回非空结果即作为下一篇使用，返回空则继续执行系统默认查询，适合实现「同分类下一篇」「同标签下一篇」等自定义逻辑。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Next` | `$post` | Post 类的 Next 接口 |

## 完整案例

下例把「下一篇」改为同分类内按发布时间正序的下一篇文章：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Next', 'demoAPP_Post_Next');
}

function demoAPP_Post_Next($post)
{
    global $zbp;

    if ($post->Type != 0) {
        return '';
    }

    $articles = $zbp->GetPostList(
        array('*'),
        array(
            array('=', 'log_Type', 0),
            array('=', 'log_Status', 0),
            array('=', 'log_CateID', $post->CateID),
            array('>', 'log_PostTime', $post->PostTime)
        ),
        array('log_PostTime' => 'ASC'),
        array(1),
        null
    );

    if (count($articles) == 1) {
        return $articles[0];
    }

    return '';
}
```

## 注意事项

- 触发时机在读取 `Next` 属性时；回调返回值只要非空（`!== ''`）就作为下一篇，返回空字符串或 `null` 时系统继续按默认规则查询全站下一篇。
- 无需设置 `PLUGIN_EXITSIGNAL_RETURN` 信号，本接口按「返回值是否为空」判断是否生效。
- 返回的结果会被缓存在当前文章对象内，同一对象重复读取 `Next` 不会重复触发本接口。
- 自定义查询请保持与系统默认相似的过滤条件（已发布 `log_Status = 0` 等），避免把草稿、审核中的文章泄露到前台。
