---
title: Z-BlogPHP 评论提交地址接口
description: 通过 Filter_Plugin_Post_CommentPostUrl 接口在 Z-BlogPHP 读取文章 CommentPostUrl 属性时接管评论提交地址，把评论表单指向自定义处理脚本。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_CommentPostUrl
  - CommentPostUrl
  - 评论提交
  - 插件接口
  - 魔术方法
---

# 评论提交地址接口

在 Z-BlogPHP 中读取文章对象的 `CommentPostUrl` 属性（评论表单的提交地址）时会触发 `Filter_Plugin_Post_CommentPostUrl` 接口，可以接管默认的 `cmd.php?act=cmt` 地址，把评论提交到自定义的处理脚本。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_CommentPostUrl` | `$post` | Post 类的 CommentPostUrl 接口 |

## 完整案例

下例把全站文章的评论提交地址改为插件自带的处理脚本：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_CommentPostUrl', 'demoAPP_Post_CommentPostUrl', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_Post_CommentPostUrl($post)
{
    global $zbp;

    return $zbp->host . 'zb_users/plugin/demoAPP/comment.php?postid=' . $post->ID;
}
```

## 注意事项

- 触发时机在读取 `CommentPostUrl` 属性时，模板中评论表单的 `action` 一般输出的就是该属性。
- 本例通过 `PLUGIN_EXITSIGNAL_RETURN` 信号无条件使用回调返回值，会完全替代默认地址；默认地址带有 `key` 参数（`CommentPostKey`）用于防垃圾提交，自定义地址需自行处理同等的安全校验。
- 自定义处理脚本完成评论入库或校验后，应按系统评论提交的参数约定转回系统命令入口，否则评论无法正常入库。
- 该接口对全站所有文章类型生效，修改后前台所有评论表单都会提交到新地址。
