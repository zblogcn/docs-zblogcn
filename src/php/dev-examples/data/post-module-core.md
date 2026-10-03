---
title: Z-BlogPHP 模块提交前过滤扩展
description: 通过 Filter_Plugin_PostModule_Core 接口在 Z-BlogPHP 模块数据入库前规范文件名、追加内容，实现侧栏模块提交数据预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostModule_Core
  - 插件接口
  - 数据写入
  - 模块编辑
---

# 模块提交前过滤扩展

通过 `Filter_Plugin_PostModule_Core` 接口，可以在 Z-BlogPHP 保存模块之前对提交数据做最后处理。该接口在 `PostModule()` 函数内触发，此时表单数据已读入 `$mod` 对象，但尚未执行系统过滤与数据库写入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostModule_Core` | `&$mod` | 模块编辑的核心接口 |

## 完整案例

下例在模块保存前，为新建的自定义模块强制加上 `demo-` 文件名前缀，避免与主题或插件自带的模块文件名冲突：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostModule_Core', 'demoAPP_PostModule_Core');
}

function demoAPP_PostModule_Core(&$mod)
{
    // 新建模块时强制自定义 FileName 前缀，避免与系统或主题模块冲突
    if ($mod->ID == 0 && $mod->Source == 'plugin' && strpos($mod->FileName, 'demo-') !== 0) {
        $mod->FileName = 'demo-' . $mod->FileName;
        $mod->HtmlID = $mod->FileName;
    }

    // 记录处理日志
    $file = $GLOBALS['zbp']->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostModule_Core #' . $mod->ID . ' ' . $mod->FileName . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostModule()` 中、`FilterMeta` 之后、`FilterModule` 与 `$mod->Save()` 之前，修改会随本次保存一起入库；
- 参数按引用传递，回调函数签名必须写成 `&$mod`，否则对模块对象的修改不会生效；
- 本接口与 `Filter_Plugin_PostModule_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存与模块重建完成后触发；
- 修改 `FileName` 会同时影响模块的重建与调用标识，编辑已有模块（`ID` 大于 0）时应避免改动，否则历史引用可能失效；
- 删除模块没有对应的 Core 接口，删除后的处理请使用 `Filter_Plugin_DelModule_Succeed`。
