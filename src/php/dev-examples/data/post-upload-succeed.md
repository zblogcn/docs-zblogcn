---
title: Z-BlogPHP 附件上传后处理扩展
description: 通过 Filter_Plugin_PostUpload_Succeed 接口在 Z-BlogPHP 附件上传成功后写日志、同步外部存储，实现附件后置处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostUpload_Succeed
  - 插件接口
  - 数据写入
  - 附件上传
---

# 附件上传后处理扩展

通过 `Filter_Plugin_PostUpload_Succeed` 接口，可以在 Z-BlogPHP 附件上传成功之后执行自定义逻辑。该接口在 `PostUpload()` 函数内触发，此时附件文件已保存到磁盘、上传记录已写入数据库、作者附件计数也已更新，适合做上传日志、外部存储同步等后续处理。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostUpload_Succeed` | `&$upload` | 附件上传成功的接口 |

## 完整案例

下例在附件上传成功后记录一条日志，包含附件 ID、原始文件名、大小与 MIME 类型：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostUpload_Succeed', 'demoAPP_PostUpload_Succeed');
}

function demoAPP_PostUpload_Succeed(&$upload)
{
    global $zbp;

    // 上传成功后写日志
    $file = $zbp->usersdir . 'plugin/demoAPP/upload.log';
    $log = date('Y-m-d H:i:s') . ' 附件上传 #' . $upload->ID
        . ' 文件=' . $upload->SourceName
        . ' 大小=' . $upload->Size
        . ' 类型=' . $upload->MimeType
        . ' 上传者=' . $upload->AuthorID . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostUpload()` 内、所有文件的 `SaveFile` 与 `$upload->Save()`、附件计数（`CountMemberArray`）完成之后，整个上传流程的收尾处；
- 该接口在一次上传请求中最多触发一次，且参数是本轮循环中最后一个处理成功的 Upload 对象：`PostUpload()` 对 `$_FILES` 逐个处理并入库，循环结束后才统一触发本接口，批量上传多个文件时不会逐个回调；
- 此时 `$upload->ID` 与 `$upload->Name`（存储名）、`$upload->SourceName`（原始名）均已可用，可直接用于外部同步或日志记录；
- 回调中的对象参数可以声明为 `&$upload` 引用，但此阶段修改对象属性不会再自动入库，确需落库应在回调内显式调用 `$upload->Save()`；
- 本接口没有对应的 Core 前置接口，若需在上传落盘前做拦截，应使用上传相关的其他系统接口或对 `CheckExtName`、`CheckSize` 的扩展点。
