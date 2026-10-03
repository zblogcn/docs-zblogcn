---
title: Z-BlogPHP 用户虚拟属性读取扩展
description: 通过 Filter_Plugin_Member_Get 接口为 Z-BlogPHP 用户对象定义虚拟属性，在读取未定义属性时返回动态计算值的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Member_Get
  - 插件接口
  - 用户
  - 虚拟属性
  - 魔术方法
---

# 用户虚拟属性读取扩展

通过 `Filter_Plugin_Member_Get` 接口，可以在 Z-BlogPHP 读取用户对象上未专属处理的属性时介入，为 Member 对象定义虚拟属性或动态计算值。读取用户对象的任何属性（如 `$member->ID`、`$member->Name`）都会先经过本接口，回调不返回时再交回系统默认读取。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Get` | `&$member, $name` | 干预 Member 类 Get 方法的接口 |

## 完整案例

下例为用户对象定义一个虚拟属性 `AvatarHtml`，模板或插件代码中直接读取 `$member->AvatarHtml` 即可得到渲染好的头像 `img` 标签：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Member_Get', 'demoAPP_Member_Get');
}

function demoAPP_Member_Get(&$member, $name)
{
    global $zbp;
    if ($name != 'AvatarHtml') {
        // 不是目标属性时立即返回，交回系统默认读取
        return;
    }
    // 置位 RETURN 信号，让本次返回值作为属性的读取结果
    $GLOBALS['Filter_Plugin_Member_Get']['demoAPP_Member_Get'] = PLUGIN_EXITSIGNAL_RETURN;
    return '<img src="' . $member->Avatar . '" alt="' . $member->StaticName . '" width="48" height="48" />';
}
```

## 注意事项

- `Url`、`Avatar`、`LevelName`、`EmailMD5`、`StaticName`、`Template`、`PassWord_MD5Path`、`IsGod`、`AliasFirst` 这几个属性由系统专属处理，不会经过本接口；除此之外的所有属性读取都会先触发回调，再走默认读取；
- 回调返回值需配合 `PLUGIN_EXITSIGNAL_RETURN` 信号才能替代属性值，信号在每次生效后被系统重置，要在回调内每次置位（如案例写法）；不置位时返回值会被忽略，默认读取照常进行；
- 由于所有属性读取都会触发本接口，回调开头必须先判断属性名，非目标属性立即返回，避免拖累全站性能；
- 回调内访问其他属性时注意避开会再次进入本接口的属性名，防止递归。
