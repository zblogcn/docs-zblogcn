---
title: Z-BlogPHP 相关文章自定义接口
description: 通过 Filter_Plugin_Post_RelatedList 接口在 Z-BlogPHP 读取文章 RelatedList 属性时接管相关文章列表，实现按标签、分类等自定义相关内容推荐。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Post_RelatedList
  - RelatedList
  - 相关文章
  - 插件接口
  - 魔术方法
---

# 相关文章自定义接口

在 Z-BlogPHP 中读取文章对象的 `RelatedList` 属性（相关文章列表）时会触发 `Filter_Plugin_Post_RelatedList` 接口，可以接管系统默认的相关文章查询，实现按标签、同分类、随机推荐等自定义逻辑。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_RelatedList` | `$post` | Post 类的 RelatedList 接口 |

## 完整案例

下例为带标签的文章按标签取相关文章，其余文章仍走系统默认的相关文章逻辑：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Post_RelatedList', 'demoAPP_Post_RelatedList');
}

function demoAPP_Post_RelatedList($post)
{
    global $zbp;

    if ($post->Type == 0 && $post->Tag != '') {
        // 动态设置 RETURN 信号，本次读取使用本回调的返回值
        SetPluginSignal('Filter_Plugin_Post_RelatedList', __FUNCTION__, PLUGIN_EXITSIGNAL_RETURN);
        return GetList(
            (int) $zbp->option['ZC_RELATEDLIST_COUNT'],
            null,
            null,
            null,
            $post->Tags,
            null,
            null
        );
    }
}
```

## 注意事项

- 触发时机在读取 `RelatedList` 属性时；系统默认逻辑是按文章标签做关联查询，本例与之类似但完全由插件控制查询条件。
- 只有回调内动态设置 `PLUGIN_EXITSIGNAL_RETURN` 信号后返回值才会生效，否则系统继续执行默认查询；如需全站接管，可在注册时静态传入 `PLUGIN_EXITSIGNAL_RETURN`。
- 返回值应为文章对象数组（`GetList` 的返回值可直接使用），模板中对 `$article->RelatedList` 的遍历会直接使用该结果。
- 相关文章查询发生在文章页渲染时，回调中的查询条件应尽量走数据库索引字段，避免在文章较多时拖慢页面。
