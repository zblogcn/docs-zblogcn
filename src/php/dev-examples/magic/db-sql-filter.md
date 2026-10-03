---
title: Z-BlogPHP SQL 语句过滤接口
description: 通过 Filter_Plugin_DbSql_Filter 接口在 Z-BlogPHP 每条 SQL 执行前拦截处理，实现 SQL 日志记录、调试统计等功能，修改语句需谨慎。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_DbSql_Filter
  - DbSql_Filter
  - SQL
  - 数据库
  - 插件接口
---

# SQL 语句过滤接口

在 Z-BlogPHP 中，所有将要执行的 SQL 语句都会经过 DbSql 类的 `Filter()` 方法，此时会触发 `Filter_Plugin_DbSql_Filter` 接口，可用于记录 SQL 日志、调试查询统计等；由于修改语句会直接影响数据库执行结果，做 SQL 改写时应格外谨慎。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_DbSql_Filter` | `$method, $args` | DbSql 类的 SQL 过滤和统计方法接口 |

## 完整案例

下例把每条 SQL 语句记录到缓存目录下的日志文件，便于开发调试：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_DbSql_Filter', 'demoAPP_DbSql_Filter');
}

function demoAPP_DbSql_Filter(&$sql)
{
    global $zbp;

    file_put_contents(
        $zbp->cachedir . 'demo-sql.log',
        date('Y-m-d H:i:s') . "\t" . $sql . PHP_EOL,
        FILE_APPEND
    );
}
```

## 注意事项

- 每一条将要执行的 SQL 都会触发本接口（前台、后台、安装、更新的全部请求），是全系统最底层的数据库接口，回调务必保持轻量。
- `$sql` 按引用传递，在回调中修改后系统将执行修改后的语句，此类改写影响面极大，仅建议在明确了解后果时使用。
- 严禁在回调中再执行任何数据库操作（包括 `$zbp->GetList()` 等封装函数），否则会再次触发本接口造成无限递归。
- 官方接口注释中参数标注为 `$method, $args`，当前版本实际调用时传入的是完整的 SQL 语句字符串，回调建议声明为 `(&$sql)`。
- 回调的返回值会被忽略；系统的查询计数（`$_SERVER['_query_count']`）在本接口触发前已自增。
