---
title: Z-BlogPHP 标签属性写入监听接口
description: 通过 Filter_Plugin_Tag_Set 接口在 Z-BlogPHP 监听标签对象每一次属性写入，实现标签字段变化监听、联动记录等功能的插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Set
  - Tag_Set
  - 属性写入
  - 魔术方法
  - 插件接口
---

# 标签属性写入监听接口

在 Z-BlogPHP 中给标签对象写入属性（例如 `$tag->Name = '...'`）时会触发 `Filter_Plugin_Tag_Set` 接口，可用于监听标签字段变化、做联动处理等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Set` | `&$this, $method, $arg` | 干预 Tag 类 Set 方法的接口 |

## 完整案例

下例在修改标签名时记录变更时间，供插件后续提示使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Set', 'demoAPP_Tag_Set');
}

function demoAPP_Tag_Set(&$tag, $name, $value)
{
    if ($name == 'Name') {
        // 联动处理：记录标签名被修改的时间
        $tag->Metas->demo_name_changed = time();
    }
}
```

## 注意事项

- 标签对象的每一次属性写入都会触发本接口（包括 `Name`、`Alias` 等常规赋值），但 `Url`、`AliasFirst` 等只读虚拟属性以及 `Template` 被专门拦截，写入这些属性不会触发。
- 回调发生在数据真正写入对象之前：回调执行完毕后，系统才把原始的 `$value` 存入对象数据。
- 回调的返回值会被忽略，无法通过返回值取消或替换本次写入；如确需修改要写入的值，可将第三参数声明为引用传递（`&$value`），修改后会以修改后的值入库，但请谨慎使用。
- 回调中给当前标签对象再赋值其他属性会再次触发本接口，注意条件收敛，避免死循环。
