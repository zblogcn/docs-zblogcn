---
title: Z-BlogPHP 通用文章保存后处理扩展
description: 通过 Filter_Plugin_PostPost_Succeed 接口在 Z-BlogPHP 各类 Post 对象保存成功后写日志、同步外部服务，实现自定义类型后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostPost_Succeed
  - 插件接口
  - 数据写入
  - 自定义类型
---

# 通用文章保存后处理扩展

通过 `Filter_Plugin_PostPost_Succeed` 接口，可以在 Z-BlogPHP 任意 Post 类对象（文章、页面及插件注册的自定义 Post 类型）保存成功之后执行自定义逻辑。该接口在 `PostPost()` 函数的末尾触发，此时对象已写入数据库，是 1.7.0 加入的通用出口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostPost_Succeed` | `&$post` | Post 类对象的通用编辑的成功接口（1.7.0 加入） |

## 完整案例

下例对所有 Post 类型统一记录保存日志，并按类型值区分写入不同的日志段，便于为自定义类型建立独立的追踪记录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostPost_Succeed', 'demoAPP_PostPost_Succeed');
}

function demoAPP_PostPost_Succeed(&$post)
{
    global $zbp;

    // 保存成功后按类型写日志
    $file = $zbp->usersdir . 'plugin/demoAPP/post-type-' . $post->Type . '.log';
    $log = date('Y-m-d H:i:s') . ' 保存 #' . $post->ID
        . ' ' . $post->Title . ' 作者=' . $post->AuthorID . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostPost()` 末尾、`$post->Save()`、评论模块重建与导航栏处理完成之后；
- 与按类型区分的 `Filter_Plugin_PostArticle_Succeed`、`Filter_Plugin_PostPage_Succeed` 不同，本接口对文章、页面提交同样会触发，具体取决于提交入口使用的是通用函数 `PostPost()` 还是专用函数；若同一提交可能触发多个保存后接口，注意避免重复处理；
- 此时 `$post->ID` 已可用：新建对象在此前 ID 为 0，进入本接口时已拿到数据库分配的 ID，可据此区分新建与更新；
- 回调中的对象参数可以声明为 `&$post` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$post->Save()`；
- 本接口与 `Filter_Plugin_PostPost_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；删除侧对应 `Filter_Plugin_DelPost_Succeed`。
