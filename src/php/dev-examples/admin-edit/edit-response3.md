---
title: Z-BlogPHP 文章编辑页右侧栏输出扩展
description: 通过 Filter_Plugin_Edit_Response3 接口在 Z-BlogPHP 后台文章编辑页右侧发布栏中追加自定义内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Edit_Response3
  - 插件接口
  - 文章编辑页
  - 右侧栏
---

# 文章编辑页右侧栏输出扩展

通过 `Filter_Plugin_Edit_Response3` 接口，可以在 Z-BlogPHP 后台文章/独立页面编辑页的右侧发布栏中追加内容，输出位置在右侧浮动区域（`divFloat`）内、加入导航栏选项之后，与分类、状态、模板等系统选项并列显示。文章和独立页面共用 `edit.php` 编辑页，该接口对两者同时生效。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_Response3` | 无 | 编辑页右侧发布栏内输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_Response3', 'demoAPP_Edit_Response3');
}

function demoAPP_Edit_Response3()
{
    global $article;
    // 与系统选项保持一致的 editmod 结构
    echo '<div class="editmod"><label for="demoapp_flag" class="editinputname">标记</label>';
    echo '<input type="text" name="meta_demoapp_flag" id="demoapp_flag" class="edit" value="" /></div>';
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容，输出位置被包裹在 `<div id="response3" class="editmod">` 内，与系统右侧选项共用浮动布局，适合放开关、下拉框等简短控件；
- 完整的「显示字段 + 保存数据」模式与注意要点参见「[文章编辑页自定义字段扩展](/php/dev-examples/admin-edit/edit-response)」，两者仅输出位置不同；
- 其他可选位置：`Filter_Plugin_Edit_Response`（正文之后）、`Filter_Plugin_Edit_Response2`（摘要之后）、`Filter_Plugin_Edit_Response4`（标题之前）、`Filter_Plugin_Edit_Response5`（标题与正文之间）。
