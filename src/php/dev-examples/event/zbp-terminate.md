---
title: Z-BlogPHP 系统终结监听扩展
description: 通过 Filter_Plugin_Zbp_Terminate 接口在 Z-BlogPHP 请求结束、数据库连接关闭前做收尾统计与日志落盘的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_Terminate
  - 插件接口
  - 系统加载
  - 收尾统计
---

# 系统终结监听扩展

通过 `Filter_Plugin_Zbp_Terminate` 接口，可以在 Z-BlogPHP 的 `Zbp::Terminate()` 中执行收尾逻辑。该方法由 `$zbp` 的析构函数在脚本结束时调用，是整次请求的最后钩子之一。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Terminate` | 无 | Zbp 类的终结接口 |

## 完整案例

下例在请求结束时把耗时与内存峰值写入统计日志（配合 `Filter_Plugin_Zbp_PreLoad` 记录的开始时间）：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_Terminate', 'demoAPP_Zbp_Terminate');
}

function demoAPP_Zbp_Terminate()
{
    global $zbp;

    $start   = isset($GLOBALS['demoAPP_start_time']) ? $GLOBALS['demoAPP_start_time'] : null;
    $elapsed = $start ? round(microtime(true) - $start, 4) : 0;

    $log = date('Y-m-d H:i:s') . ' ip=' . GetGuestIP() . ' elapsed=' . $elapsed
        . 's memory=' . memory_get_peak_usage(true) . PHP_EOL;
    file_put_contents($zbp->usersdir . 'plugin/demoAPP/stats.log', $log, FILE_APPEND | LOCK_EX);
}
```

## 注意事项

- 触发位置在 `Zbp::Terminate()` 内，由 `zblogphp.php` 中 `$zbp` 的析构函数 `__destruct()` 在脚本结束时调用，早于数据库连接关闭（`CloseConnect`）与数据库错误日志写入；
- 仅当 `$zbp` 已初始化时才会触发；回调执行时数据库对象仍可用，但应避免再执行重查询或输出内容；
- 适合做统计落盘、资源释放、日志收尾等轻量操作；
- 脚本因致命错误中断时析构流程可能不完整，关键业务逻辑不要依赖本接口；
- 高并发下写文件建议加 `FILE_APPEND` 与 `LOCK_EX`，并定期清理日志文件。
