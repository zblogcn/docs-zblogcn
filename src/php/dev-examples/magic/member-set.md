---
title: Z-BlogPHP 用户属性写入监听扩展
description: 通过 Filter_Plugin_Member_Set 接口监听 Z-BlogPHP 用户对象属性赋值，实现密码修改审计等写入监控的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Set
  - 插件接口
  - 用户
  - 写入监听
  - 魔术方法
---

# 用户属性写入监听扩展

通过 `Filter_Plugin_Member_Set` 接口，可以在 Z-BlogPHP 对用户对象进行属性赋值时得到通知，适用于写入审计、数据联动等场景。对 Member 对象任何属性的赋值（如后台编辑用户、保存文章计数）都会先触发本接口，之后再由系统写入默认存储。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Set` | `&$member, $name, $value` | 干预 Member 类 Set 方法的接口 |

## 完整案例

下例监听用户密码字段的写入，把密码变更记录到审计日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Set', 'demoAPP_Member_Set');
}

function demoAPP_Member_Set(&$member, $name, $value)
{
    global $zbp;
    if ($name != 'Password') {
        return;
    }
    $log = date('Y-m-d H:i:s') . ' member #' . $member->ID . ' password changed from ' . GetGuestIP() . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/password.log', $log, FILE_APPEND);
}
```

## 注意事项

- 对用户对象任何属性的赋值都会触发本接口（包括 `Password`、`Email` 等正常数据字段），赋值完成后系统仍会执行默认写入，回调无法阻止或修改本次写入的值（`$value` 是值拷贝）；
- `Url`、`Avatar`、`LevelName`、`EmailMD5`、`StaticName`、`PassWord_MD5Path`、`IsGod`、`AliasFirst` 是只读虚拟属性，对其赋值会被系统直接忽略，不触发本接口；`Template` 属性有专属处理逻辑，同样不触发；
- 本接口没有返回值语义，注册时无需设置 `PLUGIN_EXITSIGNAL_RETURN` 信号；
- 插件如需扩展可随用户保存的自定义数据，推荐直接写入 `$member->Metas`，而不是依赖本接口；
- 日志等回调逻辑应尽量轻量，用户保存、评论计数更新等场景都会触发属性写入。
