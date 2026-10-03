---
title: Z-BlogPHP 后台 Footer 输出扩展
description: 通过 Filter_Plugin_Admin_Footer 接口在 Z-BlogPHP 后台所有页面底部（body 结束前）追加内容或脚本的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Footer
  - 插件接口
  - 后台
  - footer
---

# 后台 Footer 输出扩展

通过 `Filter_Plugin_Admin_Footer` 接口，可以在 Z-BlogPHP 后台页面底部、`</body>` 之前追加内容，适用于加载需要在页面 DOM 之后执行的脚本、添加底部提示信息等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Footer` | 无 | 在后台页面 `</body>` 之前输出内容 |

## 完整案例

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_Footer', 'demoAPP_Admin_Footer');
}

function demoAPP_Admin_Footer()
{
    global $zbp;
    // 接口在页面主区域 </section> 之后、</body> 之前执行，直接 echo 即可
    echo '<script src="' . $zbp->host . 'zb_users/plugin/demoAPP/script/admin-footer.js"></script>';
}
```

## 注意事项

- 接口没有参数，回调函数通过 **`echo`** 输出内容；输出位置在 `zb_system/admin/admin_footer.php` 中，即页面主区域的 `</section>` 之后、`</body>` 之前；
- 该接口与 `Filter_Plugin_Admin_Header` 一样对所有后台页面生效，适合放置页脚信息或依赖页面 DOM 的脚本；
- 需要在 `<head>` 阶段加载的 CSS、JavaScript 应使用 `Filter_Plugin_Admin_Header`，两者不要混用。
