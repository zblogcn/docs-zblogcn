---
title: Z-BlogPHP 用户链接接管扩展
description: 通过 Filter_Plugin_Member_Url 接口接管 Z-BlogPHP 用户对象的 Url 属性，自定义作者页链接生成规则的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Url
  - 插件接口
  - 用户
  - Url
  - 魔术方法
---

# 用户链接接管扩展

通过 `Filter_Plugin_Member_Url` 接口，可以在 Z-BlogPHP 读取用户对象的 `Url` 属性（即作者页链接）时接管默认的生成逻辑，适用于自定义作者页地址、用户主页重写等场景。凡是通过 `$member->Url` 或模板 `{$author.Url}` 读取作者页链接的地方（评论列表、作者模块、文章作者信息等）都会触发本接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Url` | `&$member` | 干预 Member 类 Url 方法的接口 |

## 完整案例

下例把所有已注册用户的作者页链接改为插件自定义的用户主页地址：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Url', 'demoAPP_Member_Url');
}

function demoAPP_Member_Url(&$member)
{
    global $zbp;
    if ($member->ID == 0) {
        // 未注册用户等场景交回系统默认生成，不返回有效值即可
        return;
    }
    // 每次触发时重新置位 RETURN 信号，保证返回值持续生效
    $GLOBALS['Filter_Plugin_Member_Url']['demoAPP_Member_Url'] = PLUGIN_EXITSIGNAL_RETURN;
    return $zbp->host . 'u-' . $member->ID . '.html';
}
```

## 注意事项

- 接口在系统按 `list_author` 路由规则（`{%id%}`、`{%alias%}` 参数）生成作者页地址之前触发；回调的返回值需要配合 `PLUGIN_EXITSIGNAL_RETURN` 信号才能生效，信号在每次生效后会被系统重置，因此要在回调内每次置位（如案例写法）；
- 回调内不要在置位信号之后访问 `$member->Url`，否则会再次进入本接口造成递归；需要用户信息时先读取其他属性（如 `ID`、`Alias`）；
- 返回的链接必须是真实可达的地址，需要配套的自定义页面或伪静态规则，否则全站的作者页链接都会指向 404；
- 不返回有效值（信号保持默认）时，系统会继续执行默认的链接生成流程，适合只做记录、不做接管的场景。
