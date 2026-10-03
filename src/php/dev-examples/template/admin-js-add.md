---
title: Z-BlogPHP 后台脚本追加输出案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Admin_Js_Add 接口向后台公共脚本 c_admin_js_add.php 追加自定义 JS，为管理界面注入脚本逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_Js_Add
  - 后台脚本
  - 插件接口
  - 管理界面
---

# 后台脚本追加输出

`Filter_Plugin_Admin_Js_Add` 是 Z-BlogPHP 后台公共脚本 `zb_system/script/c_admin_js_add.php` 的追加接口。该脚本以后台 JS 文件形式被管理页面引用，内置后台通用交互逻辑，插件通过此接口可在脚本末尾输出自己的 JavaScript，为管理界面注入工具栏按钮、表单增强等脚本而无需改动后台模板。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Js_Add` | 无 | c_admin_js_add.php 脚本页的接口 |

## 完整案例

下例在后台公共脚本末尾追加一段 JS，为管理区 body 加标记类，并在控制台输出提示：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_Js_Add', 'demoAPP_Admin_Js_Add');
}

function demoAPP_Admin_Js_Add()
{
    // 回调内直接 echo 输出 JS 语句
    echo 'var demoAPP_admin_enabled = true;' . PHP_EOL;
    echo 'if (window.jQuery) {' . PHP_EOL;
    echo '  $(function () {' . PHP_EOL;
    echo '    $("body").addClass("demoAPP-admin-on");' . PHP_EOL;
    echo '    console.log("demoAPP 后台脚本已加载");' . PHP_EOL;
    echo '  });' . PHP_EOL;
    echo '}' . PHP_EOL;
}
```

登录后台后，管理页面加载公共脚本时即执行追加的代码，可配合 CSS 为 `.demoAPP-admin-on` 定制界面样式。

## 注意事项

- 该接口属于输出期接口，浏览器每次请求该脚本都会执行；脚本输出按内容 md5 生成 Etag，开启 304 缓存（`ZC_JS_304_ENABLE`）后内容不变时直接返回 304；
- 回调没有参数与返回值语义，输出完全依靠 `echo`，内容必须是合法 JavaScript；
- 追加位置在系统后台公共 JS 之后，可以使用脚本内已定义的变量与函数（如 `zbp`、`SetCookie` 等）；
- 该脚本面向全部后台页面加载，输出内容请做精简，避免拖慢所有管理页面；
- 如需向后台页面输出 HTML 或样式，应使用后台页面头部相关接口，本接口仅适合注入脚本逻辑。
