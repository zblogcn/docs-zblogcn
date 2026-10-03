---
title: Z-BlogPHP 通用文章删除前归档扩展
description: 通过 Filter_Plugin_DelPost_Core 接口在 Z-BlogPHP 删除 Post 对象前把数据归档为 JSON 文件，实现删除前备份留痕的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelPost_Core
  - 插件接口
  - 数据写入
  - 删除归档
---

# 通用文章删除前归档扩展

通过 `Filter_Plugin_DelPost_Core` 接口，可以在 Z-BlogPHP 删除任意 Post 类对象之前拿到完整对象数据。该接口在 `DelPost()` 函数内触发，此时权限检查已通过、对象仍完整存在于数据库中，是删除前做备份或审计的最后一道关卡，为 1.7.0 加入的通用入口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelPost_Core` | `&$post` | Post 类对象的通用删除核心接口（1.7.0 加入） |

## 完整案例

下例在删除前把 Post 对象的完整数据连同操作人、删除时间归档为一个 JSON 文件，留作审计凭证：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelPost_Core', 'demoAPP_DelPost_Core');
}

function demoAPP_DelPost_Core(&$post)
{
    // 删除前归档完整对象数据
    $data = array(
        'id' => $post->ID,
        'type' => $post->Type,
        'title' => $post->Title,
        'author_id' => $post->AuthorID,
        'content' => $post->Content,
        'deleted_by' => $GLOBALS['zbp']->user->Name,
        'deleted_time' => date('Y-m-d H:i:s'),
    );

    $dir = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/archive/';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    file_put_contents($dir . 'post-' . $post->ID . '.json', json_encode($data, JSON_UNESCAPED_UNICODE));
}
```

## 注意事项

- 触发位置：在 `DelPost()` 中、权限检查通过之后、`$post->Del()` 之前，此时对象数据仍完整，适合做删除前备份；接口执行完才会真正删除数据；
- 参数按引用传递，回调函数签名必须写成 `&$post`；在本接口中修改对象属性没有实际意义，即将删除的数据以触发时的状态为准；
- 本接口与 `Filter_Plugin_DelPost_Succeed` 是同一删除流程的前后两段：Core 在删除动作前触发，Succeed 在删除及相关计数清理完成后触发；
- 只有走通用 `DelPost()` 的删除流程才会触发本接口；文章、页面的专用删除函数 `DelArticle()`、`DelPage()` 没有对应的 Del Core 接口，只提供 `Filter_Plugin_DelArticle_Succeed`、`Filter_Plugin_DelPage_Succeed` 删除后接口；
- 若 `Post` 对象的 ID 不存在（`$post->ID` 为 0），整个删除流程会直接跳过，本接口不会触发。
