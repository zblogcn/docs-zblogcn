---
title: Z-BlogPHP 用户保存联动扩展
description: 通过 Filter_Plugin_Member_Save 接口在 Z-BlogPHP 用户保存时执行记录日志、同步外部数据等联动逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Save
  - 插件接口
  - 用户
  - 保存
  - 魔术方法
---

# 用户保存联动扩展

通过 `Filter_Plugin_Member_Save` 接口，可以在 Z-BlogPHP 保存用户数据时执行自定义逻辑。该接口在用户对象的 `Save` 方法内部、默认数据库写入之前触发，适用于保存记录日志、同步外部数据、保存前修正属性等场景。后台新建或编辑用户、登录用户评论后更新计数等操作都会触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Save` | `&$member` | Member 类的 Save 方法接口 |

## 完整案例

下例在每次用户数据保存时，把用户 ID、用户名与操作时间记录到插件日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Save', 'demoAPP_Member_Save');
}

function demoAPP_Member_Save(&$member)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' member saved #' . $member->ID . ' ' . $member->Name . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/member.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 接口在默认数据库写入之前触发，回调内修改 `$member` 的属性会影响即将保存的数据；
- 回调返回值默认无效；如需用返回值替代 `Save` 方法的返回值并跳过默认保存，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位），拦截保存需谨慎，调用方通常不检查该返回值；
- 除了后台保存用户资料，登录用户评论计数更新等场景也会调用用户对象的 `Save` 方法并触发本接口，回调逻辑应轻量、幂等；
- 写日志前请确保插件数据目录存在（可在 `InstallPlugin_demoAPP` 中创建），避免高频触发时写入失败。
