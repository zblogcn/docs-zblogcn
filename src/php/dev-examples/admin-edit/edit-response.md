---
title: Z-BlogPHP 文章编辑页自定义字段扩展
description: 通过 Filter_Plugin_Edit_Response 接口在 Z-BlogPHP 后台文章编辑页正文下方插入自定义输入框，配合 meta_ 前缀字段名实现自动保存的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Edit_Response
  - meta_ 前缀
  - 插件接口
  - 自定义字段
---

# 文章编辑页自定义字段扩展

通过 `Filter_Plugin_Edit_Response` 接口，可以在 Z-BlogPHP 后台文章/独立页面编辑页正文中插入自定义表单内容（例如额外的输入框），适用于为文章增加自定义字段的场景。该接口输出位置在正文编辑器之后、别名字段之前，处于编辑页左侧主区域。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_Response` | 无 | 编辑页左侧正文编辑器之后输出内容 |

## 完整案例

下例在编辑页增加一个「SEO 描述」输入框：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_Response', 'demoAPP_Edit_Response');
}

// 显示：在编辑页输出输入框
function demoAPP_Edit_Response()
{
    // edit.php 在全局作用域执行，可直接 global 当前正在编辑的文章对象（新建时 ID 为 0）
    global $article;
    $desc = isset($article->Metas->demoapp_desc) ? $article->Metas->demoapp_desc : '';
    echo '<div class="editmod2"><label for="demoapp_desc" class="editinputname">SEO 描述</label>';
    echo '<input type="text" name="meta_demoapp_desc" id="demoapp_desc" maxlength="250" value="' . htmlspecialchars($desc) . '" /></div>';
}
```

## 数据保存

插件**不需要**自己写保存代码。Z-BlogPHP 在文章、独立页面、分类、标签、用户、模块的保存流程中都会执行 `FilterMeta()`，自动把表单中所有 `meta_` 前缀的字段写入对应对象的 `Metas`：字段 `meta_demoapp_desc` 保存后即为 `$article->Metas->demoapp_desc`，前台模板中同样可通过该方式读取。

需要处理非 `meta_` 前缀字段或做额外逻辑时，才需要挂载 `Filter_Plugin_PostArticle_Succeed`（独立页面为 `Filter_Plugin_PostPage_Succeed`）等保存接口。

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容，输出位置被包裹在 `<div id="response" class="editmod2">` 内；
- `meta_` 前缀字段的值为**空字符串时该 Meta 键会被自动删除**，因此读取时应先用 `isset()` 判断键是否存在；
- 文章和独立页面共用该编辑页与接口，只对文章生效时可在回调中判断 `$article->Type == 0`；
- 编辑页处于 `<form>` 内，输出的 `<input>` 等字段会随表单一起提交；
- 如需在其他位置插入内容，可选用 `Filter_Plugin_Edit_Response2`（摘要之后）、`Filter_Plugin_Edit_Response3`（右侧栏）、`Filter_Plugin_Edit_Response4`（标题之前）、`Filter_Plugin_Edit_Response5`（标题与正文之间）。
