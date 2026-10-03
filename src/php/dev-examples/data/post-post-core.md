---
title: Z-BlogPHP 通用文章提交前过滤扩展
description: 通过 Filter_Plugin_PostPost_Core 接口在 Z-BlogPHP 各类 Post 对象入库前统一修改提交数据，实现自定义类型内容过滤的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostPost_Core
  - 插件接口
  - 数据写入
  - 自定义类型
---

# 通用文章提交前过滤扩展

通过 `Filter_Plugin_PostPost_Core` 接口，可以在 Z-BlogPHP 保存任意 Post 类对象（文章、页面及插件注册的自定义 Post 类型）之前对提交数据做最后处理。该接口在 `PostPost()` 函数内触发，此时表单数据已读入 `$post` 对象，但尚未执行系统内容过滤与数据库写入，是 1.7.0 加入的通用入口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostPost_Core` | `&$post` | Post 类对象的通用编辑的核心接口（1.7.0 加入） |

## 完整案例

下例对所有 Post 类型统一做敏感词替换，并根据类型区分处理：文章与页面直接替换正文，自定义类型额外记录类型值便于排查：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostPost_Core', 'demoAPP_PostPost_Core');
}

function demoAPP_PostPost_Core(&$post)
{
    // 所有 Post 类型统一做正文敏感词替换
    $banned = array('违禁词A', '违禁词B');
    $post->Content = str_ireplace($banned, '***', $post->Content);

    // 按类型记录日志，便于区分文章、页面与自定义类型
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostPost_Core #' . $post->ID
        . ' Type=' . $post->Type . ' ' . $post->Title . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostPost()` 中、`FilterMeta` 与更新时间设置之后、`FilterPost` 与 `$post->Save()` 之前，修改会随本次保存一起入库；
- 参数按引用传递，回调函数签名必须写成 `&$post`，否则对对象的修改不会生效；
- 与按类型区分的 `Filter_Plugin_PostArticle_Core`、`Filter_Plugin_PostPage_Core` 不同，本接口对文章、页面提交同样会触发，即一次提交可能先走本接口（`PostPost()` 内）再走或替代对应类型接口，具体取决于提交入口使用的是通用函数还是专用函数；若同时挂载，注意避免重复处理；
- 本接口与 `Filter_Plugin_PostPost_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存完成后触发；
- 需要判断具体类型时使用 `$post->Type` 属性，配合 `$zbp->GetPostType()` 可获取类型定义信息。
