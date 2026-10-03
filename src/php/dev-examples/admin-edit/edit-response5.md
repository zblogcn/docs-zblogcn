---
title: Z-BlogPHP 文章编辑页标题与正文之间输出扩展
description: 通过 Filter_Plugin_Edit_Response5 接口在 Z-BlogPHP 后台文章编辑页标题输入框与正文编辑器之间追加自定义内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Edit_Response5
  - 插件接口
  - 文章编辑页
---

# 文章编辑页标题与正文之间输出扩展

通过 `Filter_Plugin_Edit_Response5` 接口，可以在 Z-BlogPHP 后台文章/独立页面编辑页的标题输入框与正文编辑器之间追加内容，处于编辑页左侧主区域的上部。文章和独立页面共用 `edit.php` 编辑页，该接口对两者同时生效。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_Response5` | 无 | 编辑页左侧标题输入框与正文编辑器之间输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_Response5', 'demoAPP_Edit_Response5');
}

function demoAPP_Edit_Response5()
{
    global $article;
    echo '<div class="editmod2"><label for="demoapp_subtitle" class="editinputname">副标题</label>';
    echo '<input type="text" name="meta_demoapp_subtitle" id="demoapp_subtitle" maxlength="250" value="" /></div>';
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容，输出位置被包裹在 `<div id="response5" class="editmod2">` 内，紧邻标题下方，适合放副标题等与标题强相关的字段；
- 完整的「显示字段 + 保存数据」模式与注意要点参见「[文章编辑页自定义字段扩展](/php/dev-examples/admin-edit/edit-response)」，两者仅输出位置不同；
- 其他可选位置：`Filter_Plugin_Edit_Response`（正文之后）、`Filter_Plugin_Edit_Response2`（摘要之后）、`Filter_Plugin_Edit_Response3`（右侧栏）、`Filter_Plugin_Edit_Response4`（标题之前）。
