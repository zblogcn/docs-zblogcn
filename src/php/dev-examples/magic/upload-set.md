---
title: Z-BlogPHP 附件属性写入监听扩展
description: 通过 Filter_Plugin_Upload_Set 接口监听 Z-BlogPHP 附件对象属性赋值，实现附件重命名记录等写入监控的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_Set
  - 插件接口
  - 附件
  - 写入监听
  - 魔术方法
---

# 附件属性写入监听扩展

通过 `Filter_Plugin_Upload_Set` 接口，可以在 Z-BlogPHP 对附件对象进行属性赋值时得到通知，适用于写入审计、数据联动等场景。对 Upload 对象任何属性的赋值（如上传时设置文件名、后台修改附件信息）都会先触发本接口，之后再由系统写入默认存储。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_Set` | `&$upload, $name, $value` | 干预 Upload 类 Set 方法的接口 |

## 完整案例

下例监听附件文件名字段的写入，把每次文件名变更记录到插件日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_Set', 'demoAPP_Upload_Set');
}

function demoAPP_Upload_Set(&$upload, $name, $value)
{
    global $zbp;
    if ($name != 'Name') {
        return;
    }
    $log = date('Y-m-d H:i:s') . ' upload name set to ' . $value . PHP_EOL;
    @file_put_contents($zbp->usersdir . 'plugin/demoAPP/upload.log', $log, FILE_APPEND);
}
```

## 注意事项

- 对附件对象任何属性的赋值都会触发本接口（包括 `Name`、`SourceName`、`MimeType` 等正常数据字段），赋值完成后系统仍会执行默认写入，回调无法阻止或修改本次写入的值（`$value` 是值拷贝）；
- `Url`、`Dir`、`FullFile`、`Author` 是只读虚拟属性，对其赋值会被系统直接忽略，不触发本接口；
- 上传流程中系统会对附件对象连续赋值（`Name`、`SourceName`、`MimeType`、`Size`、`AuthorID` 等），本接口会随之多次触发，回调逻辑务必轻量；
- 本接口没有返回值语义，注册时无需设置 `PLUGIN_EXITSIGNAL_RETURN` 信号。
