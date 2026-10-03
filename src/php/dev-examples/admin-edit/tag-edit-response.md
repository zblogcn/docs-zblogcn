---
title: Z-BlogPHP 标签编辑页表单输出扩展
description: 通过 Filter_Plugin_Tag_Edit_Response 接口在 Z-BlogPHP 后台标签编辑页表单字段之后追加自定义输入框，配合 meta_ 前缀字段名实现自动保存的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Tag_Edit_Response
  - meta_ 前缀
  - 插件接口
  - 标签编辑页
---

# 标签编辑页表单输出扩展

通过 `Filter_Plugin_Tag_Edit_Response` 接口，可以在 Z-BlogPHP 后台标签编辑页表单字段之后、提交按钮之前追加自定义表单内容，适用于为标签增加自定义字段（如标签说明图、SEO 标题等）的场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Edit_Response` | 无 | 标签编辑页表单字段之后输出内容 |

## 完整案例

下例在标签编辑页增加一个「SEO 标题」输入框：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Tag_Edit_Response', 'demoAPP_Tag_Edit_Response');
}

// 显示：在标签编辑页输出输入框
function demoAPP_Tag_Edit_Response()
{
    global $tag;
    $seoTitle = isset($tag->Metas->demoapp_seotitle) ? $tag->Metas->demoapp_seotitle : '';
    echo '<p><span class="title">SEO 标题:</span><br />';
    echo '<input class="edit" size="40" name="meta_demoapp_seotitle" type="text" value="' . htmlspecialchars($seoTitle) . '" /></p>';
}
```

## 数据保存

插件**不需要**自己写保存代码。Z-BlogPHP 在文章、独立页面、分类、标签、用户、模块的保存流程中都会执行 `FilterMeta()`，自动把表单中所有 `meta_` 前缀的字段写入对应对象的 `Metas`：字段 `meta_demoapp_seotitle` 保存后即为 `$tag->Metas->demoapp_seotitle`，前台模板中同样可通过该方式读取。

需要处理非 `meta_` 前缀字段或做额外逻辑时，才需要挂载 `Filter_Plugin_PostTag_Succeed` 等保存接口。

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容，输出位置在「加入导航栏」字段之后、提交按钮之前，被包裹在 `<div id='response' class='editmod2'>` 内；系统表单字段使用 `<p><span class="title">...</span></p>` 段落结构，插件自行输出时建议与之保持统一风格；
- `meta_` 前缀字段的值为**空字符串时该 Meta 键会被自动删除**，因此读取时应先用 `isset()` 判断键是否存在；
- 回调中可通过 `global $tag` 访问当前正在编辑的标签对象，新建标签时 `ID` 为 0。
