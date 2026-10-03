---
title: Z-BlogPHP 标签提交前规范扩展
description: 通过 Filter_Plugin_PostTag_Core 接口在 Z-BlogPHP 标签数据入库前规范名称、校验长度，实现标签提交数据预处理的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_PostTag_Core
  - 插件接口
  - 数据写入
  - 标签编辑
---

# 标签提交前规范扩展

通过 `Filter_Plugin_PostTag_Core` 接口，可以在 Z-BlogPHP 保存标签之前对提交数据做最后处理。该接口在 `PostTag()` 函数内触发，此时表单数据已读入 `$tag` 对象，但尚未执行系统过滤、重名检查与数据库写入。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostTag_Core` | `&$tag` | 标签编辑的核心接口 |

## 完整案例

下例在标签保存前统一去掉名称首尾空白与内部多余空格，并对超长名称做长度校验：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_PostTag_Core', 'demoAPP_PostTag_Core');
}

function demoAPP_PostTag_Core(&$tag)
{
    global $zbp;

    // 名称规范化：去首尾空白、压缩内部连续空格
    $tag->Name = preg_replace('/\s+/', ' ', trim($tag->Name));

    // 长度校验：超过 20 个字符时中止保存
    if (mb_strlen($tag->Name, 'UTF-8') > 20) {
        $zbp->ShowError('标签名称过长，保存已阻止', __FILE__, __LINE__);
    }

    // 记录处理日志
    $file = $zbp->usersdir . 'plugin/demoAPP/core.log';
    $log = date('Y-m-d H:i:s') . ' PostTag_Core #' . $tag->ID . ' ' . $tag->Name . PHP_EOL;
    file_put_contents($file, $log, FILE_APPEND);
}
```

## 注意事项

- 触发位置：在 `PostTag()` 中、`FilterMeta` 之后、`FilterTag`、重名检查与 `$tag->Save()` 之前，修改会随本次保存一起入库；
- 除在标签管理界面保存标签外，保存文章时系统自动创建新标签（`PostArticle_CheckTagAndConvertIDtoString` 内）也会触发本接口，因此对名称的规范化会同时作用于这两条路径；
- 参数按引用传递，回调函数签名必须写成 `&$tag`，否则对标签对象的修改不会生效；
- 本接口与 `Filter_Plugin_PostTag_Succeed` 是同一保存流程的前后两段：Core 在保存前触发、可改数据，Succeed 在保存与标签模块重建完成后触发；
- 重名检查发生在本接口之后，若在此处修改了 `$tag->Name`，系统将按修改后的名称做重名比对。
