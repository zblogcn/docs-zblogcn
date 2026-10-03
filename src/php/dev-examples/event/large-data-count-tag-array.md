---
title: Z-BlogPHP 大数据标签计数监听接口案例
description: 通过 Filter_Plugin_LargeData_CountTagArray 接口监听 Z-BlogPHP 文章标签关联计数的增减，实现计数同步与自定义统计。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_LargeData_CountTagArray
  - 插件接口
  - 大数据
  - 标签计数
---

# 大数据标签计数监听

`Filter_Plugin_LargeData_CountTagArray` 挂载在函数 `CountTagArrayString()` 内部。文章发布、更新或删除时，系统通过该函数解析文章的标签串并按增减值更新标签的关联文章计数，本接口在执行计数更新前触发，插件可以在此同步维护自己的标签统计表或关联索引，用于大数据量场景下的计数优化。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_CountTagArray` | `$string, $plus, $articleid` | 大数据增减文章标签关联表 |

## 完整案例

下例把每次标签计数的增减动作同步记录到插件自建的数据表中，供插件自身的聚合统计使用：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_LargeData_CountTagArray', 'demoAPP_LargeData_CountTagArray');
}

function demoAPP_LargeData_CountTagArray($array, $plus, $articleid)
{
    global $zbp;
    // $array 是 Tag 对象数组（由 LoadTagsByIDString 解析而来），$plus 为 +1 或 -1，$articleid 为文章 ID
    foreach ($array as $tag) {
        $sql = $zbp->db->sql->Insert('%pre%demoapp_tagcount', array(
            array('tc_TagID', (int) $tag->ID),
            array('tc_ArticleID', (int) $articleid),
            array('tc_Plus', (int) $plus),
            array('tc_Time', time()),
        ));
        $zbp->db->Insert($sql);
    }
    return true;
}
```

## 注意事项

- 触发位置在 `zb_system/function/c_system_function.php` 的 `CountTagArrayString()` 函数内；文章发布与更新（`c_system_event.php` 中增减新旧标签计数）、文章删除、后台批量删除文章时都会经由该函数触发；
- 接口清单中的参数名为 `$string`，实际回调收到的是 `Tag` 对象数组（`$zbp->LoadTagsByIDString()` 的返回值）、增减值 `$plus`（`+1` 或 `-1`）与文章 ID `$articleid`；
- 本接口的执行循环带有信号检查：注册时把退出信号设为 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值即成为 `CountTagArrayString()` 的返回值，系统对 `zbp_tag` 表计数的默认更新将被跳过，适合完全自建计数体系的场景；
- 接管系统计数后，标签页的文章数量展示将完全依赖插件自身的维护逻辑，需确保增减操作严格成对，否则计数会漂移；未接管时本接口仅适合做旁路记录与同步；
- 计数动作发生在文章保存的关键路径上，回调内的 SQL 应保持简单，避免在批量删除大量文章时拖慢后台操作。
