---
title: Z-BlogPHP 外链跳转页自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_ViewExternalLink_Template 接口定制外链跳转页模板变量与模板，实现跳转提示与安全控制的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_ViewExternalLink_Template
  - 外链跳转
  - 插件接口
  - external-link
---

# 外链跳转页自定义

`Filter_Plugin_ViewExternalLink_Template` 是 Z-BlogPHP 定义外链跳转输出模板的接口，在 `ViewExternalLink()` 函数中、`$template->Display()` 之前触发。当访客通过站内路由（URL 携带 `external_link` 参数，对应路由 `active_post_article_view_external_link`）访问外链跳转页时，系统已设置 `title`、`ok`（来源校验结果）、`link`（过滤后的目标链接）三个标签并选定 `external-link` 模板，插件可在此修改标签或更换模板。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewExternalLink_Template` | `&$template` | 定义 ViewExternalLink 输出模板接口 |

## 完整案例

下例在跳转页追加提示变量，并对非白名单域名的链接做安全降级，把目标改回站点首页：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_ViewExternalLink_Template', 'demoAPP_ViewExternalLink_Template');
}

function demoAPP_ViewExternalLink_Template(&$template)
{
    global $zbp;

    // 读取系统预设标签：ok 为来源校验结果，link 为过滤后的目标链接
    $ok = $template->GetTags('ok');
    $link = $template->GetTags('link');

    if ($ok) {
        // 注入自定义标签，跳转页模板中可用 {$demo_wait} 输出
        $template->SetTags('demo_wait', '页面将在片刻后跳转，请注意核对目标地址');

        // 仅放行本站域名，其余链接降级为站点首页
        $host = parse_url($link, PHP_URL_HOST);
        $siteHost = parse_url($zbp->host, PHP_URL_HOST);
        if ($host !== false && $host !== null && strcasecmp($host, $siteHost) !== 0) {
            $template->SetTags('link', $zbp->host);
        }
    }
}
```

主题的 `external-link` 模板中写入 `{$demo_wait}` 即可展示提示；若目标域名不在白名单内，跳转页显示的目标链接会被替换为站点首页。

## 注意事项

- 该接口属于输出期接口，仅在通过带 `external_link` 参数的站内路由访问跳转页时触发，不影响前台正文里外链的生成；
- 参数是 `Template` 对象（引用传入），可通过 `GetTags`、`SetTags` 操作模板变量，也可用 `SetTemplate()` 更换本次渲染的模板（默认 `external-link`）；
- 系统已预设 `title`、`ok`、`link` 三个标签：`ok` 为来源 Referer 与路由参数的校验结果，`link` 已经过 `FormatString` 的去脚本过滤，修改时请保持转义；
- 回调执行完毕后系统立即 `$template->Display()` 输出，无返回值语义；
- 使用主题外的自定义模板需确保模板已编译或存在于编译目录，否则 `Display` 会因文件不可读而报错。
