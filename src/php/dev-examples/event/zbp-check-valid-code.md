---
title: Z-BlogPHP 验证码比对扩展
description: 通过 Filter_Plugin_Zbp_CheckValidCode 接口接管 Z-BlogPHP 登录、评论等场景的验证码比对逻辑的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_CheckValidCode
  - 插件接口
  - 验证码
  - 安全校验
---

# 验证码比对扩展

通过 `Filter_Plugin_Zbp_CheckValidCode` 接口，可以接管 Z-BlogPHP 的验证码比对。系统在登录、发表评论等场景调用 `Zbp::CheckValidCode()` 比对验证码，挂载本接口后由插件决定是否放行。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_CheckValidCode` | `$vaidcode, $id` | Zbp 类的比对验证码接口，具有唯一性 |

## 完整案例

下例与 `Filter_Plugin_Zbp_ShowValidCode` 配套，实现算术题验证码的比对逻辑：

```php
<?php

RegisterPlugin("demoAPP", "ActivePlugin_demoAPP");

function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Zbp_ShowValidCode', 'demoAPP_ShowValidCode');
    Add_Filter_Plugin('Filter_Plugin_Zbp_CheckValidCode', 'demoAPP_CheckValidCode');
}

function demoAPP_ShowValidCode($id)
{
    global $zbp;

    $a = rand(1, 9);
    $b = rand(1, 9);
    $hash_pre = $zbp->guid . $zbp->path;
    setcookie('captcha_' . crc32($zbp->guid . $id), md5($hash_pre . date('YmdH') . ($a + $b)), 0, $zbp->cookiespath);

    $img = imagecreatetruecolor(120, 40);
    $bg = imagecolorallocate($img, 245, 245, 245);
    $fg = imagecolorallocate($img, 60, 60, 60);
    imagefill($img, 0, 0, $bg);
    imagestring($img, 5, 20, 12, $a . ' + ' . $b . ' = ?', $fg);
    header('Content-type: image/png');
    imagepng($img);
    imagedestroy($img);
    exit;
}

function demoAPP_CheckValidCode($verifyCode, $id)
{
    global $zbp;

    // 读取并销毁比对 Cookie
    $original = GetVars('captcha_' . crc32($zbp->guid . $id), 'COOKIE');
    setcookie('captcha_' . crc32($zbp->guid . $id), '', time() - 3600, $zbp->cookiespath);

    // 比对答案 md5，返回 true 表示验证通过
    $answer = strtolower(trim($verifyCode));
    if ($answer == '' || $original == '') {
        return false;
    }

    $hash_pre = $zbp->guid . $zbp->path;
    return $original == md5($hash_pre . date('YmdH') . $answer);
}
```

## 注意事项

- 触发位置在 `Zbp::CheckValidCode()` 内；核心的登录流程（`VerifyLogin`，事件 id 为 login、按分钟校验）与发表评论等场景都会调用本接口；
- 「唯一性」的含义：核心只取第一个挂载回调的返回值作为比对结果，返回 true 表示验证通过，返回 false 则验证失败；
- 回调实际会收到 `$verifyCode, $id, $timecompare` 三个参数；接口清单标注的参数为 `$vaidcode, $id`（源码变量名为 `$verifyCode`）；
- 挂载本接口后，核心默认的 Cookie 比对逻辑不再执行，验证码安全性由插件自行负责，务必与 `Filter_Plugin_Zbp_ShowValidCode` 成对实现；
- 比对完成后应销毁一次性 Cookie，防止重复提交时重放同一验证码。
