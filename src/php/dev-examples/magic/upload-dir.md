---
title: Z-BlogPHP 附件目录自定义扩展
description: 通过 Filter_Plugin_Upload_Dir 接口自定义 Z-BlogPHP 附件的存储目录规则，实现按类型分目录存储等场景的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Upload_Dir
  - 插件接口
  - 附件
  - 存储目录
  - 魔术方法
---

# 附件目录自定义扩展

通过 `Filter_Plugin_Upload_Dir` 接口，可以在 Z-BlogPHP 读取附件对象的 `Dir` 属性（相对于 `zb_users` 的存储目录）时接管默认逻辑，适用于按文件类型分目录、自定义目录结构等场景。该规则同时决定新附件的保存位置与所有附件的访问地址、物理路径的计算结果。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_Dir` | `$upload` | Upload 类的 Dir 方法接口 |

## 完整案例

下例把图片类附件改存到 `upload/image/` 下的年月子目录，其余类型返回空值交回系统默认目录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Upload_Dir', 'demoAPP_Upload_Dir');
}

function demoAPP_Upload_Dir($upload)
{
    global $zbp;
    if (strpos($upload->MimeType, 'image') === false) {
        // 非图片类附件返回空值，交回系统默认目录规则
        return '';
    }
    return 'upload/image/' . date('Y', $upload->PostTime) . '/' . date('m', $upload->PostTime) . '/';
}
```

## 注意事项

- 本接口的返回值非空即生效，不需要设置 `PLUGIN_EXITSIGNAL_RETURN` 信号；返回空值时交回系统默认目录（`upload/年/月/`，开启选项后含日目录）；自 Z-BlogPHP 1.7.3 起支持空值回退；
- 返回的目录必须以 `/` 结尾：系统的物理路径按 `usersdir . Dir . Name` 拼接、访问地址按 `host . 'zb_users/' . Dir . Name` 拼接，缺少结尾斜杠会把文件名直接拼进目录名；
- 附件的 `Dir`、`Url`、`FullFile` 都由本规则动态计算，规则一旦变更，已上传附件的访问地址可能与实际存放位置不再对应，导致 404，目录规则应一次确定、谨慎调整；
- 本接口影响所有附件的地址与路径计算，与 `Filter_Plugin_Upload_Url` 接口搭配使用时注意两者指向一致。
