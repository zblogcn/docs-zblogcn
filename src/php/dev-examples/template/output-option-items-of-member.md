---
title: Z-BlogPHP 作者下拉列表自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfMember 接口过滤后台作者下拉中的用户选项，实现按等级精简作者列表的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfMember
  - 作者下拉
  - 下拉选项
  - 插件接口
---

# 作者下拉列表自定义

`Filter_Plugin_OutputOptionItemsOfMember` 是 Z-BlogPHP `OutputOptionItemsOfMember()` 函数内的接口，该函数按当前用户权限与文章类型生成作者 `select` 下拉选项（"用户 ID => 用户名"）。接口在用户列表构建完成、输出 `option` 之前触发，可对最终列表做二次过滤。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfMember` | `$default, $tz` | 定义 OutputOptionItemsOfMember 函数里的接口 |

## 完整案例

下例把作者下拉精简为"仅管理员与当前选中的作者"：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfMember', 'demoAPP_OutputOptionItemsOfMember');
}

function demoAPP_OutputOptionItemsOfMember($default, &$tz)
{
    global $zbp;

    foreach ($tz as $id => $name) {
        // 键 0 为空占位项，$default 为当前选中的作者，均保留
        if ($id == 0 || $id == $default) {
            continue;
        }
        $m = $zbp->GetMemberByID($id);
        if ($m->Level != ZC_MEMBER_LEVER_ADMINISTRATOR) {
            unset($tz[$id]);
        }
    }
}
```

启用插件后，后台文章编辑页的作者下拉中只显示管理员与当前作者，其余用户被隐藏。

## 注意事项

- 该接口属于输出期接口，在后台渲染作者下拉时触发（文章编辑页等场景），仅影响下拉显示，不校验提交值；
- `$tz` 是"用户 ID => 用户名"数组，须声明为引用（`&$tz`）修改才能生效；`$default` 是当前选中的用户 ID；无权限用户场景下系统只写入当前用户或空项；
- 选项数组构建前系统已按文章类型的权限动作（`GetPostType` 返回的 all/edit 权限）与 `ZC_OUTPUT_OPTION_MEMBER_MAX_LEVEL` 配置做过筛选，本接口是最终出口的再加工；
- 若注册时指定 `PLUGIN_EXITSIGNAL_RETURN`，回调返回值会直接替代整个下拉输出；
- 需要在用户列表构建之前预置固定选项时，应改用 `Filter_Plugin_OutputOptionItemsOfMember_Begin` 前置接口。
