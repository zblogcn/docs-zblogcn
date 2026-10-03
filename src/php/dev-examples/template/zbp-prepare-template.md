---
title: Z-BlogPHP 模板目录动态切换案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Zbp_PrepareTemplate 接口在创建模板对象前修改主题与模板目录，实现移动端使用另一套模板的完整案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_PrepareTemplate
  - 模板目录
  - 插件接口
  - 移动端适配
---

# 模板目录动态切换

`Filter_Plugin_Zbp_PrepareTemplate` 是 Z-BlogPHP 的 `PrepareTemplate` 接口，在 `Zbp::PrepareTemplate()` 创建模板对象的过程中触发。回调以引用方式拿到 `$theme`（主题名）与 `$template_dirname`（模板目录名），修改后系统会按新值执行 `SetPath()` 与 `LoadTemplates()`，决定本次请求读取哪套模板。该接口是同一主题下维护多套模板目录的官方入口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_PrepareTemplate` | `&$theme, &$template_dirname` | Zbp 类的 PrepareTemplate 接口 |

## 完整案例

下例根据访问设备的 UA，让同一主题在移动端改用 `template_wap` 模板目录：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_PrepareTemplate', 'demoAPP_Zbp_PrepareTemplate');
}

function demoAPP_Zbp_PrepareTemplate(&$theme, &$template_dirname)
{
    // 仅在主题提供 wap 模板目录时切换
    global $zbp;
    $dir = $zbp->usersdir . 'theme/' . $zbp->theme . '/template_wap/';
    if (isset($_SERVER['HTTP_USER_AGENT'])
        && stripos($_SERVER['HTTP_USER_AGENT'], 'Mobile') !== false
        && is_dir($dir)) {
        $template_dirname = 'template_wap';
    }
}
```

在主题目录下创建 `template_wap/` 并放入与 `template/` 同名的一套模板，移动端访问即自动使用该目录；编译产物会写入独立的 `compiled/主题名___template_wap/` 目录，互不干扰。

## 注意事项

- 该接口属于运行期接口，随 `$zbp->Load()` 每次请求触发一次（创建模板对象时），修改即时生效，无需重建模板；
- 两个参数都以引用传入，回调签名应为 `(&$theme, &$template_dirname)`；修改 `$theme` 会直接更换本次请求使用的主题；
- 切换到新模板目录后，需要按源码注释的提示调用 `$zbp->BuildTemplateMore()` 对其它模板目录做一次重新编译，否则新目录没有编译产物；
- 模板编译缓存的 md5 按主题与 `template_dirname` 分别记录，两套目录的重建互不影响；
- 修改 `$template_dirname` 时请确保目录存在，目录缺失会导致读取不到模板文件而渲染出错。
