---
title: Z-BlogPHP 附件保存联动扩展
description: 通过 Filter_Plugin_Upload_SaveFile 接口在 Z-BlogPHP 附件保存时执行备份、加水印、同步云存储等联动处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_SaveFile
  - 插件接口
  - 附件
  - 上传
  - 魔术方法
---

# 附件保存联动扩展

通过 `Filter_Plugin_Upload_SaveFile` 接口，可以在 Z-BlogPHP 保存上传附件的临时文件时执行自定义处理。该接口在附件对象的 `SaveFile` 方法内部、系统移动临时文件之前触发，`$tmp` 参数是 PHP 的上传临时文件路径，适用于备份、加水印、病毒扫描、同步云存储等上传后同步处理场景。核心调用点是后台上传附件（`PostUpload` 函数），批量上传时每个文件各触发一次。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_SaveFile` | `$tmp, $upload` | Upload 类的 SaveFile 方法接口 |

## 完整案例

下例在系统保存附件前，先把临时文件备份到插件目录，并记录上传日志，便于后续异步处理（如加水印提示、同步备份）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_SaveFile', 'demoAPP_Upload_SaveFile');
}

function demoAPP_Upload_SaveFile($tmp, &$upload)
{
    global $zbp;
    // 在系统移动临时文件之前，先复制一份到插件目录
    $dir = $zbp->usersdir . 'plugin/demoAPP/inbox/';
    if (!file_exists($dir)) {
        @mkdir($dir, 0755, true);
    }
    if (is_file($tmp)) {
        @copy($tmp, $dir . $upload->Name);
    }
    $log = date('Y-m-d H:i:s') . ' upload saved ' . $upload->Name . ' (' . $upload->MimeType . ')' . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/upload.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 回调触发时附件对象已完成 `Name`、`MimeType`、`Size` 等属性赋值并通过了扩展名与大小检查，但目录创建与文件移动尚未执行；
- `$tmp` 是 PHP 上传临时文件路径，不接管时可以读取、复制，但不要移动或删除它，系统稍后会用 `move_uploaded_file` 把它移入上传目录；
- 如需完全接管保存（如云存储插件），须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位）返回结果，此时目录创建、扩展名检查与文件移动的默认流程全部跳过，插件必须自行处理临时文件，否则附件数据库记录会与物理文件不一致；
- 不接管时回调返回值无效，默认保存流程照常执行。
