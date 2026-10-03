---
title: Z-BlogPHP 用户头像自定义扩展
description: 通过 Filter_Plugin_Member_Avatar 接口替换 Z-BlogPHP 用户头像地址，接入 Gravatar 镜像源等自定义头像服务的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Avatar
  - 插件接口
  - 用户
  - 头像
  - Gravatar
---

# 用户头像自定义扩展

通过 `Filter_Plugin_Member_Avatar` 接口，可以在 Z-BlogPHP 读取用户对象的 `Avatar` 属性（头像地址）时接管默认逻辑，适用于接入 Gravatar 镜像源、按邮箱生成头像等场景。评论列表、用户展示、作者信息等处读取 `$member->Avatar` 时都会触发本接口，这是官方 Gravatar 插件所使用的接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Avatar` | `$member` | Member 类的 Avatar 接口 |

## 完整案例

下例把有邮箱的用户头像替换为 Gravatar 镜像源地址，无邮箱的用户交回系统默认头像：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Avatar', 'demoAPP_Member_Avatar');
}

function demoAPP_Member_Avatar($member)
{
    global $zbp;
    if ($member->Email == '') {
        // 返回空值，交回系统默认头像逻辑
        return '';
    }
    return '//dn-qiniu-avatar.qbox.me/avatar/' . md5(strtolower($member->Email)) . '.png?s=80&d=mm';
}
```

## 注意事项

- 本接口的返回值非空即生效，直接作为头像地址输出到 `img` 标签的 `src` 中，不需要设置 `PLUGIN_EXITSIGNAL_RETURN` 信号；
- 返回空值（空字符串、null）时交回系统默认逻辑：本地 `zb_users/avatar/{用户ID}.png` 存在则使用，否则使用默认头像 `zb_users/avatar/0.png`；
- 多个插件注册本接口时，第一个返回非空的回调生效，后续回调不再执行；
- 头像地址计算结果会缓存在用户对象内部，同一个 Member 对象的 `Avatar` 属性只计算一次；地址建议使用协议相对（`//` 开头）或完整 https 地址，避免与站点协议不一致。
