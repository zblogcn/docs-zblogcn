---
title: Z-BlogPHP 后台管理页结束监听扩展
description: 通过 Filter_Plugin_Admin_End 接口在 Z-BlogPHP 后台管理页输出完成后执行清理、日志等自定义逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Admin_End
  - 插件接口
  - 后台流程监听
---

# 后台管理页结束监听扩展

通过 `Filter_Plugin_Admin_End` 接口，可以在 Z-BlogPHP 后台管理页（`zb_system/admin/index.php`，即 `cmd.php?act=...` 指向的各类管理页）内容输出完成后执行自定义逻辑，适用于清理临时资源、记录操作日志等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_End` | 无 | 后台管理页输出完成后触发，在 `RunTime()` 计算执行耗时之前 |

## 完整案例

下例在后台管理页访问结束后记录一条简单的操作日志：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_End', 'demoAPP_Admin_End');
}

function demoAPP_Admin_End()
{
    global $zbp;
    // 页面内容已输出完毕，可安全写入日志
    $log = $zbp->user->Name . ' 访问了后台操作 ' . $zbp->action . "\n";
    file_put_contents($zbp->path . 'zb_users/plugin/demoAPP/admin.log', $log, FILE_APPEND);
}
```

## 注意事项

- 接口没有参数，回调函数通过 `echo` 输出内容会出现在页脚之后，一般不用于输出可见内容；
- 该接口只作用于 `zb_system/admin/index.php` 入口下的管理页，不作用于各编辑页和 `cmd.php` 提交操作；
- 触发时 `admin_footer.php` 已输出完毕，页面 HTML 已全部生成，适合执行不需要向前台反馈的收尾逻辑；
- 系统自身也通过该接口挂载了 `Include_Admin_CheckHttp304OK`（用于 HTTP 304 缓存判断），插件写法与之一致。
