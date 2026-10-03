---
title: Z-BlogPHP 文章编辑页尾部输出扩展
description: 通过 Filter_Plugin_Edit_End 接口在 Z-BlogPHP 后台文章和独立页面编辑页的表单结束后追加脚本等内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Edit_End
  - 插件接口
  - 文章编辑页
  - 后台输出
---

# 文章编辑页尾部输出扩展

通过 `Filter_Plugin_Edit_End` 接口，可以在 Z-BlogPHP 后台文章/独立页面编辑页表单结束之后追加内容，适用于加载依赖编辑页 DOM 的脚本、输出页脚提示信息等场景。文章和独立页面共用 `edit.php` 编辑页，该接口对两者同时生效。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Edit_End` | 无 | 编辑页表单结束后、页脚加载前输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Edit_End', 'demoAPP_Edit_End');
}

function demoAPP_Edit_End()
{
    global $zbp;
    // 此处表单元素已全部输出，可以安全编写操作表单 DOM 的脚本
    echo '<script src="' . $zbp->host . 'zb_users/plugin/demoAPP/script/edit.js"></script>';
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容；调用位置在 `zb_system/admin/edit.php` 末尾，即编辑表单 `</form>` 及内置初始化脚本之后、页脚模板加载之前；
- 此时编辑器初始化脚本 `editor_init()` 尚未执行（它在这之后调用），如脚本依赖编辑器就绪，建议通过 `editor_api.editor.content.ready()` 等编辑器就绪回调来延迟执行；
- 在 `<head>` 阶段需要加载的样式应使用 `Filter_Plugin_Edit_Begin`，两个接口不要混用。
