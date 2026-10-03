---
title: Z-BlogPHP 附件文件删除联动扩展
description: 通过 Filter_Plugin_Upload_DelFile 接口在 Z-BlogPHP 删除附件物理文件时同步清理缩略图、缓存等关联文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_DelFile
  - 插件接口
  - 附件
  - 删除文件
  - 魔术方法
---

# 附件文件删除联动扩展

通过 `Filter_Plugin_Upload_DelFile` 接口，可以在 Z-BlogPHP 删除附件的物理文件时执行自定义逻辑。该接口在附件对象的 `DelFile` 方法内部、默认删除文件之前触发，适用于同步清理插件为附件生成的缩略图、缓存文件，或接管云存储文件的删除。核心调用点是后台删除附件（`DelUpload` 函数）与删除用户时清理其名下附件（`DelMember_AllData` 函数）。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_DelFile` | `$upload` | Upload 类的 DelFile 方法接口 |

## 完整案例

下例在附件物理文件被删除时，同步删除插件为该附件生成的缩略图文件：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_DelFile', 'demoAPP_Upload_DelFile');
}

function demoAPP_Upload_DelFile(&$upload)
{
    global $zbp;
    // 同步删除插件为该附件生成的缩略图文件
    $thumb = $zbp->usersdir . 'plugin/demoAPP/thumb/' . md5($upload->Name) . '.jpg';
    if (file_exists($thumb)) {
        @unlink($thumb);
    }

    return true;
}
```

## 注意事项

- `DelFile` 只负责删除物理文件（默认删除目标是 `$upload->FullFile`），数据库记录由 `Del` 方法处理，两个接口要区分使用；
- 回调返回值默认无效；如需用返回值替代 `DelFile` 方法的返回值并跳过默认的本地文件删除（适合云存储插件在回调内自行完成远端与本地清理，可参考 upyun 等插件的实现），须配合 `PLUGIN_EXITSIGNAL_RETURN` 信号（在回调内每次置位）；
- 默认删除使用 `@unlink`，文件不存在或权限不足时静默失败，对外部一致性有要求的插件应在回调内自行校验删除结果；
- 删除用户时会逐个清理其名下附件，本接口会随每个附件各触发一次。
