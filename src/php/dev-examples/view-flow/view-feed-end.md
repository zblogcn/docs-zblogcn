---
title: Z-BlogPHP RSS 对象输出前监听扩展
description: 通过 Filter_Plugin_ViewFeed_End 接口在 Z-BlogPHP 的 ViewFeed() 函数 RSS 对象输出前修改 RSS 内容或追加自定义节点的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewFeed_End
  - 插件接口
  - 前台流程监听
  - RSS 订阅
---

# RSS 对象输出前监听扩展

通过 `Filter_Plugin_ViewFeed_End` 接口，可以在 Z-BlogPHP 的 `ViewFeed()` 函数 RSS 对象输出前修改 RSS 内容或追加自定义节点，适用于追加自定义标签、修改 RSS 标题等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewFeed_End` | `object &$rss2` | `ViewFeed()` RSS 对象输出前触发，`$rss2` 为 RSS 对象 |

## 完整案例

下例在 RSS 输出前，修改 RSS 频道标题，为订阅者追加站点副标题信息：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewFeed_End', 'demoAPP_ViewFeed_End');
}

function demoAPP_ViewFeed_End(&$rss2)
{
    global $zbp;
    // 修改 RSS 频道标题为站点名称 + 副标题
    $rss2->setChannelElement('title', $zbp->name . ' - 最新文章');
}
```

## 注意事项

- 参数 `$rss2` 为 RSS 对象，需要在回调签名中使用引用传递 `&$rss2` 才能修改；
- 该接口只在 `feed.php` 入口触发，不作用于 `index.php`、`search.php` 等其他入口；
- 触发时 RSS 数据已经组装完毕，适合追加或修改节点，不建议在此处做复杂的重生成操作；
- 通过 RSS 对象提供的方法可以修改 channel 属性或条目属性，具体方法请参考系统使用的 RSS 类库文档。
