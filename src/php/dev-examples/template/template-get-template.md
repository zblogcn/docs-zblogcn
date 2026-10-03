---
title: Z-BlogPHP 模板路径获取接口替换案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Template_GetTemplate 接口拦截模板路径获取过程，把指定模板指向插件自带文件的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Template_GetTemplate
  - 模板路径
  - 插件接口
  - template 标签
---

# 模板路径获取接口替换

`Filter_Plugin_Template_GetTemplate` 是 Z-BlogPHP 模板类的读模板前置接口，在 `Template::GetTemplate($name)` 中触发。该方法默认返回编译后模板文件的完整路径（`zb_users/cache/compiled/主题名/模板名.php`），核心程序在模板内 `{template:xxx}` 嵌套标签编译成的 `include $this->GetTemplate('xxx')` 语句中调用它，因此每次渲染包含嵌套标签的页面都会触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Template_GetTemplate` | `$this, $name` | Template 类读取一个模板前的接口 |

## 完整案例

下例把所有 `{template:sidebar}` 嵌套调用指向插件自带的侧栏文件，其余模板名保持系统默认路径。需要以 `PLUGIN_EXITSIGNAL_RETURN` 方式注册，回调返回值才会替代默认路径：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Template_GetTemplate', 'demoAPP_Template_GetTemplate', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_Template_GetTemplate($template, $name)
{
    global $zbp;

    // 把名为 sidebar 的模板指向插件自带文件
    if ($name == 'sidebar') {
        return $zbp->usersdir . 'plugin/demoAPP/tpl/sidebar.php';
    }

    // 其余模板名必须返回系统默认的编译文件路径，否则 include 会失败
    return $template->path . $name . '.php';
}
```

在插件目录下创建 `tpl/sidebar.php`，前台所有通过 `{template:sidebar}` 引入侧栏的位置即改为输出插件提供的文件内容。

## 注意事项

- 该接口属于运行期接口：只要模板渲染过程中调用 `GetTemplate` 就会触发，包含 `{template:xxx}` 嵌套标签的页面每次访问都会触发多次，回调应尽量轻量；
- 必须以 `PLUGIN_EXITSIGNAL_RETURN` 作为 `Add_Filter_Plugin` 的第三个参数注册，回调返回值才能替代默认路径；未命中自定义逻辑的模板名一定要返回系统默认路径 `$template->path . $name . '.php'`；
- `$name` 参数是模板名（不含路径与扩展名），回调按名称判断即可；
- 返回的路径指向的文件将在渲染时被 `include`，请确保文件存在且内容是可执行的 PHP 模板；
- 该接口不影响 `Display()` 直接渲染入口模板的过程（入口模板路径由 `$entryPage` 决定），只影响通过 `GetTemplate` 获取路径的调用。
