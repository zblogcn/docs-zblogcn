---
title: Z-BlogPHP 文章保存联动接口
description: 通过 Filter_Plugin_Post_Save 接口在 Z-BlogPHP 文章保存入库前执行联动处理，如自动补全字段、记录保存时间，或按需拦截保存操作。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Save
  - Post_Save
  - 文章保存
  - 插件接口
  - 魔术方法
---

# 文章保存联动接口

在 Z-BlogPHP 中调用文章对象的 `Save()` 方法时（后台发布、更新文章，前台提交等最终都会走到这里），会在数据入库前触发 `Filter_Plugin_Post_Save` 接口，适合做保存前的字段补全、数据校验和联动处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Save` | `&$post` | Post 类的 Save 方法接口 |

## 完整案例

下例在保存前为空标题的文章补一个默认标题，并把保存时间记录到 Metas：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Save', 'demoAPP_Post_Save');
}

function demoAPP_Post_Save(&$post)
{
    global $zbp;

    if ($post->Title == '' || $post->Title == $zbp->lang['msg']['unnamed']) {
        $post->Title = '未命名文章 ' . date('Y-m-d H:i');
    }
    $post->Metas->demo_last_save = time();
}
```

## 注意事项

- 触发时机在数据入库之前：默认注册方式（不传中断信号）下回调的返回值被忽略，回调中修改 `$post` 的属性会随本次保存一起写入数据库。
- 若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调的返回值将直接作为 `Save()` 的返回值，并跳过数据库写入，可用于有条件地阻止保存（返回 `false`），此时应自行向用户说明原因。
- 回调中修改文章属性时注意不要再对当前对象调用 `Save()`，否则会再次触发本接口造成递归。
- 该接口对全站所有文章类型（文章、页面及自定义类型）生效，回调内请按 `$post->Type` 做必要的类型判断。
