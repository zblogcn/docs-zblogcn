---
title: Z-BlogPHP 模块删除后处理扩展
description: 通过 Filter_Plugin_DelModule_Succeed 接口在 Z-BlogPHP 模块删除成功后写日志、清理自定义侧栏缓存，实现删除后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DelModule_Succeed
  - 插件接口
  - 数据写入
  - 删除后处理
---

# 模块删除后处理扩展

通过 `Filter_Plugin_DelModule_Succeed` 接口，可以在 Z-BlogPHP 模块删除成功之后执行自定义逻辑。该接口在 `DelModule()` 函数内触发，此时模块已从数据库删除，适合做删除留痕与关联缓存清理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DelModule_Succeed` | `&$mod` | 模块删除成功的接口 |

## 完整案例

下例在模块删除成功后记录一条日志，包含被删模块的 ID、文件名与来源，便于追溯侧栏变动：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DelModule_Succeed', 'demoAPP_DelModule_Succeed');
}

function demoAPP_DelModule_Succeed(&$mod)
{
    global $zbp;

    // 删除成功后写日志，对象属性仍可读取，但数据已不在数据库中
    $file = $zbp->usersdir . 'plugin/demoAPP/del-module.log';
    $log = date('Y-m-d H:i:s') . ' 模块删除 #' . $mod->ID
        . ' FileName=' . $mod->FileName . ' 来源=' . $mod->Source
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `DelModule()` 中、`$mod->Del()` 之后、函数返回之前；该函数有两条删除路径——按 ID 删除与按主题来源加文件名删除（`source=theme`），两条路径都会触发本接口；
- 只有非系统模块（`Source` 不等于 `system`）可以删除，系统自带模块删除请求会被直接拒绝，因此不会触发本接口；
- 触发时模块已从数据库删除，但内存中的 `$mod` 属性仍可读取，适合做删除日志；不要再对该对象调用 `Save()`，否则会把已删除的数据重新写回；
- 删除流程没有对应的 Core 前置接口，保存侧对应接口为 `Filter_Plugin_PostModule_Succeed`，两者分别位于删除与保存两条独立流程；
- 模块删除后侧栏不会自动重排，如插件维护了自定义侧栏布局缓存，应在本接口内按 `$mod->FileName` 清理对应条目。
