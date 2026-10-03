---
title: Z-BlogPHP 浏览计数自定义接口案例
description: 通过 Filter_Plugin_ViewPost_ViewNums 接口接管 Z-BlogPHP 文章浏览计数逻辑，实现防重复计数与自定义统计。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewPost_ViewNums
  - 插件接口
  - 浏览计数
  - 访问统计
---

# 浏览计数自定义

`Filter_Plugin_ViewPost_ViewNums` 挂载在 Z-BlogPHP 的文章浏览计数环节：前台文章页渲染（`ViewPost`）时，以及 API 获取文章并携带 `viewnums` 参数时，系统默认会把文章的浏览数加一并写回数据库；一旦有插件注册了本接口，默认的加一与落库逻辑被完全替换，浏览计数交给插件的回调自行处理，适合实现防刷计数、第三方统计同步等场景。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_ViewNums` | `&$article` | 定义 ViewPost 浏览数接口 |

## 完整案例

下例实现同一访客对同一篇文章 24 小时内只计一次的防刷计数，插件自己负责更新数据库：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewPost_ViewNums', 'demoAPP_ViewPost_ViewNums');
}

function demoAPP_ViewPost_ViewNums($article)
{
    global $zbp;
    $key = 'demoapp_vn_' . $article->ID;
    if (isset($_COOKIE[$key])) {
        // 24 小时内已计数，仅返回当前值，不再累加
        return (int) $article->ViewNums;
    }
    setcookie($key, '1', time() + 86400, '/');
    $viewnums = (int) $article->ViewNums + 1;
    // 注册本接口后系统不再写库，计数持久化需插件自行完成
    $sql = $zbp->db->sql->Update($zbp->table['Post'], array('log_ViewNums' => $viewnums), array(array('=', 'log_ID', $article->ID)));
    $zbp->db->Update($sql);
    return $viewnums;
}
```

## 注意事项

- 有两个触发位置：`zb_system/function/c_system_route.php` 中前台文章页渲染时的计数环节，以及 `zb_system/api/post.php` 中 API 请求文章且带 `viewnums` 参数时的计数环节；
- 两处触发都以 `$zbp->option['ZC_VIEWNUMS_TURNOFF']` 为前提，该选项为 `true`（后台设置中关闭浏览计数）时整个计数环节被跳过，本接口也不会触发；
- 只要本接口存在已注册的回调，系统默认的 `ViewNums + 1` 与数据库 UPDATE 语句都不再执行，回调的返回值会被赋给 `$article->ViewNums`（多个回调时以最后一个的返回值为准），计数是否落库、如何去重完全由插件决定；
- 接口清单中的参数名带有引用符（`&$article`），实际传入的是 `Post` 文章对象，回调返回整数即可，无需修改对象属性；
- 计数环节位于文章页输出的关键路径上，回调内避免执行耗时操作；如需抵御高频刷新，建议结合 Cookie、Session 或缓存键做去重，而不是每次都读写数据库。
