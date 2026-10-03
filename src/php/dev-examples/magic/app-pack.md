---
title: Z-BlogPHP 应用打包干预接口
description: 通过 Filter_Plugin_App_Pack 接口在 Z-BlogPHP 后台打包应用生成 zba 文件前干预文件清单，如从安装包中排除日志与临时文件。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_App_Pack
  - App_Pack
  - 应用打包
  - zba
  - 插件接口
---

# 应用打包干预接口

在 Z-BlogPHP 后台打包应用（生成 `.zba` 安装包）时，系统收集完应用目录下的全部目录与文件之后、写入 XML 包内容之前，会触发 `Filter_Plugin_App_Pack` 接口，插件可借此增删打包清单，例如把日志、临时文件排除出安装包。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_App_Pack` | `$this, $this->dirs, $this->files` | App 类的 Pack 方法接口 |

## 完整案例

下例在打包本插件时，把开发调试产生的日志文件从安装包中排除：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_App_Pack', 'demoAPP_App_Pack');
}

function demoAPP_App_Pack($app, &$dirs, &$files)
{
    if ($app->id == 'demoAPP') {
        foreach ($files as $key => $file) {
            if (stripos($file, 'debug.log') !== false) {
                unset($files[$key]);
            }
        }
    }
}
```

## 注意事项

- 触发时机在后台执行应用打包操作时；`$dirs` 与 `$files` 是应用内全部目录与文件的完整路径数组，均按引用传递，修改后直接影响打包内容。
- 回调的返回值会被忽略；如需向包中追加文件，应使用 `$app->app_path` 拼接完整路径后加入 `$files` 数组，系统会自动换算为包内相对路径。
- `$dirs`、`$files` 是 App 类的私有属性，只能在回调的引用参数上修改，不要试图通过 `$app->dirs` 直接访问。
- 该接口对所有应用的打包操作触发，回调内应先用 `$app->id` 判断目标应用，避免误改其他应用的安装包。
