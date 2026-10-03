---
title: Z-BlogPHP 侧栏模块重建扩展案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Zbp_BuildModule 接口在重建模块内容前把自定义模块加入重建队列，实现侧栏动态内容的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_BuildModule
  - 侧栏模块
  - 插件接口
  - AddBuildModule
---

# 侧栏模块重建扩展

`Filter_Plugin_Zbp_BuildModule` 是 Z-BlogPHP 的生成模块内容接口，在 `Zbp::BuildModule()` 内、`ModuleBuilder::Build()` 正式重建模块之前触发。回调没有参数，典型用法是在重建开始前调用 `$zbp->AddBuildModule()` 把需要刷新的模块加入本轮重建队列。后台发表文章、删除评论、保存设置等操作引发模块重建时都会执行该接口。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_BuildModule` | 无 | Zbp 类的生成模块内容的接口 |

## 完整案例

下例注册一个自定义"站点公告"模块，并在每次模块重建时把它加入重建队列，使公告内容随模块重建持续刷新：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_RegBuildModules', 'demoAPP_RegBuildModules');
    Add_Filter_Plugin('Filter_Plugin_Zbp_BuildModule', 'demoAPP_Zbp_BuildModule');
}

// 注册模块构建函数
function demoAPP_RegBuildModules()
{
    global $zbp;
    $zbp->RegBuildModule('demoAPP_notice', 'demoAPP_BuildNotice');
}

// 每次重建模块前，把自定义模块加入本轮重建队列
function demoAPP_Zbp_BuildModule()
{
    global $zbp;
    $zbp->AddBuildModule('demoAPP_notice');
}

// 构建函数的返回值会写入模块 Content 并保存到数据库
function demoAPP_BuildNotice()
{
    global $zbp;
    $count = $zbp->cache->normal_article_nums;
    return '<ul><li>本站已发布文章 ' . (int) $count . ' 篇，感谢支持。</li></ul>';
}

// 启用插件时创建模块记录
function InstallPlugin_demoAPP()
{
    global $zbp;
    if (!isset($zbp->modulesbyfilename['demoAPP_notice'])) {
        $m = new Module();
        $m->Name = '站点公告';
        $m->FileName = 'demoAPP_notice';
        $m->Source = 'plugin_demoAPP';
        $m->HtmlID = 'demoAPP_notice';
        $m->Type = 'ul';
        $m->Content = '';
        $m->Save();
    }
}
```

启用插件后把"站点公告"模块加入侧栏，之后每次后台操作触发模块重建时，公告内容都会由构建函数重新生成。

## 注意事项

- 该接口属于运行期接口，无参数也无返回值语义，触发位置在 `ModuleBuilder::Build()` 之前，适合做重建前的队列准备；
- 触发时机与内容变化绑定：后台保存或删除文章、评论、分类、标签、用户、模块，保存全局设置，切换主题等操作会调用 `BuildModule()`，对应 API 操作同样会触发；
- 模块构建函数的返回值写入模块 `Content` 字段并保存到数据库，重建后前台展示的是保存后的内容，不在渲染时动态执行；
- `AddBuildModule()` 只会把已存在模块记录的文件名加入重建队列，插件需在安装时创建模块记录并注册构建函数（见案例）；
- 系统默认的 9 个模块（catalog、calendar、comments 等）由 `RegBuildModules()` 注册，如需注册自定义模块构建函数应配合 `Filter_Plugin_Zbp_RegBuildModules` 接口。
