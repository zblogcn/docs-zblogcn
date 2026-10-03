---
title: Z-BlogPHP 附件记录删除联动扩展
description: 通过 Filter_Plugin_Upload_Del 接口在 Z-BlogPHP 删除附件数据库记录时执行记录日志、同步数据等联动操作的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_Del
  - 插件接口
  - 附件
  - 删除
  - 魔术方法
---

# 附件记录删除联动扩展

通过 `Filter_Plugin_Upload_Del` 接口，可以在 Z-BlogPHP 删除附件的数据库记录时执行自定义逻辑。该接口在附件对象的 `Del` 方法内部、默认数据库删除之前触发，此时附件的数据库记录与物理文件都还存在。核心调用点是后台删除附件（`DelUpload` 函数）与删除用户时清理其名下附件（`DelMember_AllData` 函数）。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_Del` | `$upload` | Upload 类的 Del 方法接口 |

## 完整案例

下例在附件数据库记录被删除时，记录删除日志（可作为同步清理外部系统数据的依据）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_Del', 'demoAPP_Upload_Del');
}

function demoAPP_Upload_Del(&$upload)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' upload record deleted #' . $upload->ID . ' ' . $upload->Name . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/upload.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 后台删除附件的执行顺序是先调用 `Del` 删除数据库记录，再调用 `DelFile` 删除物理文件，本接口只覆盖前者，物理文件删除对应 `Filter_Plugin_Upload_DelFile` 接口；
- 用 `PLUGIN_EXITSIGNAL_RETURN` 信号拦截本接口只能跳过数据库记录删除，不会阻止随后的物理文件删除，容易造成「记录还在、文件已删」的不一致状态，拦截时务必两端一起考虑；
- 回调触发时附件数据完整可读，可在此记录 `ID`、`Name`、`FullFile` 等信息供后续处理；
- 删除用户时系统会逐个删除其名下附件，本接口会随每个附件各触发一次。
