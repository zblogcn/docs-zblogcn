---
title: Z-BlogPHP 自定义侧栏模块注册案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_Zbp_RegBuildModules 接口注册自定义模块构建函数，让插件模块像系统模块一样重建内容的完整案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_RegBuildModules
  - 模块注册
  - 插件接口
  - RegBuildModule
---

# 自定义侧栏模块注册

`Filter_Plugin_Zbp_RegBuildModules` 是 Z-BlogPHP 的注册模块接口，在 `Zbp::RegBuildModules()` 中触发。系统在该方法里注册 catalog、calendar、comments、previous、archives、navbar、tags、statistics、authors 共 9 个默认模块的构建函数之后调用此接口，插件可在此通过 `$zbp->RegBuildModule()` 注册自己的模块构建函数。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_RegBuildModules` | 无 | Zbp 类的注册模块时的接口 |

## 完整案例

下例注册一个"热门标签云"构建函数，模块重建时自动生成内容：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_RegBuildModules', 'demoAPP_RegBuildModules');
}

// 系统注册完默认模块后触发，在这里注册自定义模块构建函数
function demoAPP_RegBuildModules()
{
    global $zbp;
    $zbp->RegBuildModule('demoAPP_hotTags', 'demoAPP_BuildHotTags');
}

// 构建函数返回值写入模块 Content 并保存
function demoAPP_BuildHotTags()
{
    global $zbp;
    $tags = $zbp->GetTagList('', array(), array('tag_Order' => 'DESC'), 10, null);
    $s = '<ul>';
    foreach ($tags as $tag) {
        $s .= '<li><a href="' . $tag->Url . '">' . $tag->Name . '</a></li>';
    }
    return $s . '</ul>';
}

// 启用插件时创建模块记录
function InstallPlugin_demoAPP()
{
    global $zbp;
    if (!isset($zbp->modulesbyfilename['demoAPP_hotTags'])) {
        $m = new Module();
        $m->Name = '热门标签';
        $m->FileName = 'demoAPP_hotTags';
        $m->Source = 'plugin_demoAPP';
        $m->HtmlID = 'demoAPP_hotTags';
        $m->Type = 'ul';
        $m->Content = '';
        $m->Save();
    }
}
```

启用插件并把"热门标签"模块加入侧栏，之后模块重建时内容会由构建函数自动刷新。

## 注意事项

- 该接口属于运行期接口，无参数无返回值，随 `$zbp->Load()` 每次请求触发一次，回调只需完成注册动作，不要做重活；
- 触发位置在 9 个系统默认模块注册之后，注册自定义模块不会影响系统模块；
- `RegBuildModule($fileName, $function)` 只登记构建函数，真正生成内容发生在 `$zbp->BuildModule()` 重建时，且模块记录需已存在于数据库；
- 构建函数接收 `$zbp->AddBuildModule()` 传入的参数，返回值写入模块 `Content` 并保存；
- 若希望每次模块重建都顺带重建自己的模块，需配合 `Filter_Plugin_Zbp_BuildModule` 接口把模块加入重建队列。
