---
title: Z-BlogPHP 模块保存后处理扩展
description: 通过 Filter_Plugin_PostModule_Succeed 接口在 Z-BlogPHP 模块保存成功后写变更日志、重建自定义侧栏缓存，实现模块后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostModule_Succeed
  - 插件接口
  - 数据写入
  - 模块管理
---

# 模块保存后处理扩展

通过 `Filter_Plugin_PostModule_Succeed` 接口，可以在 Z-BlogPHP 模块保存成功之后执行自定义逻辑。该接口在 `PostModule()` 函数的末尾触发，此时模块已写入数据库、对应侧栏模块也已重建，适合做变更日志、缓存同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostModule_Succeed` | `&$mod` | 模块编辑成功的接口 |

## 完整案例

下例在模块保存成功后记录变更日志，标明模块文件名与内容长度，便于排查侧栏内容被谁改动：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostModule_Succeed', 'demoAPP_PostModule_Succeed');
}

function demoAPP_PostModule_Succeed(&$mod)
{
    global $zbp;

    // 保存成功后写变更日志
    $file = $zbp->usersdir . 'plugin/demoAPP/module.log';
    $log = date('Y-m-d H:i:s') . ' 模块保存 #' . $mod->ID
        . ' FileName=' . $mod->FileName
        . ' 内容长度=' . mb_strlen($mod->Content, 'UTF-8')
        . ' 操作人=' . $zbp->user->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostModule()` 末尾、`$mod->Save()` 与按 `FileName` 的模块重建（仅编辑已有模块时执行）完成之后；
- 此时 `$mod->ID` 与 `$mod->FileName` 已是最终值，做模块定位或缓存键时可直接使用；注意 `FileName` 可能是系统在提交为空时随机生成的 `mod` 加四位数字；
- 回调中的对象参数可以声明为 `&$mod` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$mod->Save()`；
- 本接口与 `Filter_Plugin_PostModule_Core` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存后触发；
- 新建模块（提交 ID 为 0）时系统不会执行按 FileName 的重建，如需立即渲染自定义模块内容，可在本接口内自行调用 `$zbp->AddBuildModule()`；删除模块请使用 `Filter_Plugin_DelModule_Succeed`。
