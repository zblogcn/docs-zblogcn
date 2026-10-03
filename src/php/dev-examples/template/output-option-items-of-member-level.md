---
title: Z-BlogPHP 用户等级下拉自定义案例
description: 通过 Z-BlogPHP 的 Filter_Plugin_OutputOptionItemsOfMemberLevel 接口整体替换用户等级下拉选项，按权限过滤可选等级的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_OutputOptionItemsOfMemberLevel
  - 用户等级
  - 下拉选项
  - 插件接口
---

# 用户等级下拉自定义

`Filter_Plugin_OutputOptionItemsOfMemberLevel` 是 Z-BlogPHP `OutputOptionItemsOfMemberLevel()` 函数内的接口，该函数负责生成后台的用户等级 `select` 下拉选项。默认逻辑是：无 `MemberAll` 权限时只显示当前用户自己的等级，有权限时显示全部等级。接口在该函数输出 `option` 之前触发。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_OutputOptionItemsOfMemberLevel` | `$default, $tz` | 定义 OutputOptionItemsOfMemberLevel 函数里的接口 |

## 完整案例

下例以 `PLUGIN_EXITSIGNAL_RETURN` 方式注册，整体接管下拉输出：非 root 用户的选择列表中移除"管理员"等级。注意源码实际只向回调传入 `$default` 一个参数，`$tz` 不会传入，因此只能通过返回值替换整个下拉：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_OutputOptionItemsOfMemberLevel', 'demoAPP_OutputOptionItemsOfMemberLevel', PLUGIN_EXITSIGNAL_RETURN);
}

function demoAPP_OutputOptionItemsOfMemberLevel($default)
{
    global $zbp;

    $levels = $zbp->lang['user_level_name'];
    if (!$zbp->CheckRights('root')) {
        unset($levels[ZC_MEMBER_LEVER_ADMINISTRATOR]);
    }
    // 保证当前所选等级仍在列表中
    if (!isset($levels[$default])) {
        $levels[$default] = $zbp->lang['user_level_name'][$default];
    }

    $s = '';
    foreach ($levels as $level => $levelname) {
        $s .= '<option value="' . $level . '" ' . ($default == $level ? 'selected="selected"' : '') . ' >' . $levelname . '</option>';
    }
    return $s;
}
```

启用插件后，非管理员在后台打开用户等级下拉时将看不到"管理员"等级选项。

## 注意事项

- 该接口属于输出期接口，在后台渲染用户等级下拉时触发（用户编辑页等场景），仅影响下拉显示，不校验提交值；
- 源码调用处为 `$fpname($default)`，实际只传 `$default`（当前选中的等级值），清单中的 `$tz` 不会传入，也无法通过引用修改；
- 需以 `PLUGIN_EXITSIGNAL_RETURN` 注册，回调返回的字符串才会替代默认的 `option` 列表，返回内容须是完整的 `<option>` HTML；
- 等级名称与数量以 `$zbp->lang['user_level_name']` 为准，等级常量可用 `ZC_MEMBER_LEVER_ADMINISTRATOR`（1）等系统常量；
- 显示过滤只是界面限制，保存权限仍由系统权限体系控制，不要仅依赖下拉过滤实现安全策略。
