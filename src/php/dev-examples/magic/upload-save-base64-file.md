---
title: Z-BlogPHP 附件 Base64 保存扩展
description: 通过 Filter_Plugin_Upload_SaveBase64File 接口在 Z-BlogPHP 保存 Base64 编码附件时执行记录、校验、接管等处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_SaveBase64File
  - 插件接口
  - 附件
  - Base64
  - XML-RPC
---

# 附件 Base64 保存扩展

通过 `Filter_Plugin_Upload_SaveBase64File` 接口，可以在 Z-BlogPHP 保存 Base64 编码的附件数据时执行自定义处理。该接口在附件对象的 `SaveBase64File` 方法内部、系统解码写入文件之前触发，`$str64` 参数是未经解码的 Base64 字符串。核心调用点是 XML-RPC 接口的文件上传方法（`wp.uploadFile` 等），适用于记录远程发布行为、接管存储等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_SaveBase64File` | `$str64, $upload` | Upload 类的 SaveBase64File 方法接口 |

## 完整案例

下例记录每次 Base64 方式上传的附件信息，便于审计远程客户端的发布行为：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_SaveBase64File', 'demoAPP_Upload_SaveBase64File');
}

function demoAPP_Upload_SaveBase64File($str64, &$upload)
{
    global $zbp;
    $log = date('Y-m-d H:i:s') . ' base64 upload ' . $upload->Name . ', data length ' . strlen($str64) . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/upload.log', $log, FILE_APPEND);

    return true;
}
```

## 注意事项

- 后台普通上传走的是 `SaveFile` 方法（对应 `Filter_Plugin_Upload_SaveFile` 接口），不会触发本接口；本接口只在 Base64 编码数据的保存流程中触发，当前核心调用点是 XML-RPC 接口；
- `$str64` 是未解码的 Base64 字符串，数据长度按解码前的字符串计算；
- 如需完全接管存储，须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位）返回结果，此时目录创建、扩展名检查与 `base64_decode` 解码写入的默认流程全部跳过，插件必须自行完成解码与落盘，否则附件数据库记录会与物理文件不一致；
- 不接管时回调返回值无效，默认保存流程照常执行。
