---
title: Z-BlogPHP 文章缩略图干预接口
description: 通过 Filter_Plugin_Post_Thumbs 接口在 Z-BlogPHP 调用文章 Thumbs 方法时干预缩略图结果，如无图文章使用默认占位图、强制缩略图尺寸等。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_Thumbs
  - Post_Thumbs
  - 缩略图
  - 插件接口
  - 魔术方法
---

# 文章缩略图干预接口

在 Z-BlogPHP 中调用文章对象的 `Thumbs()` 方法获取缩略图时会触发 `Filter_Plugin_Post_Thumbs` 接口，回调可直接修改图片列表与宽高、数量、裁剪等参数，常用于给无图文章配默认占位图、强制统一尺寸等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Thumbs` | `&$this, &$all_images, &$width, &$height, &$count, &$clip` | 干预 Post 类 Thumbs 方法的接口 |

## 完整案例

下例为没有图片的文章返回插件自带的占位图，其余文章保持系统默认行为：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_Thumbs', 'demoAPP_Post_Thumbs');
}

function demoAPP_Post_Thumbs(&$post, &$all_images, &$width, &$height, &$count, &$clip)
{
    global $zbp;

    if (empty($all_images)) {
        $all_images = array($zbp->host . 'zb_users/plugin/demoAPP/placeholder.png');
    }
}
```

## 注意事项

- 触发时机在调用 `$post->Thumbs($width, $height, $count, $clip)` 时、系统裁剪处理之前，模板输出缩略图的场景一般都会经过这里。
- 除 `$post` 外的五个参数均为引用传递，直接修改 `$all_images`、`$width`、`$height`、`$count`、`$clip` 即可生效，无需返回。
- 本接口默认注册方式下返回值被忽略；若注册时传入 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值将完全替代 `Thumbs()` 的返回结果（数组），可完全接管缩略图逻辑。
- 修改尺寸与数量会影响缩略图生成开销，`$count` 与 `$width`、`$height` 不要设置得过大，以免影响列表页性能。
