---
title: Z-BlogPHP 验证码显示扩展
description: 通过 Filter_Plugin_Zbp_ShowValidCode 接口把 Z-BlogPHP 默认图片验证码替换为算术题验证码的完整插件案例。
keywords:
  - Z-BlogPHP
  - Filter_Plugin_Zbp_ShowValidCode
  - 插件接口
  - 验证码
  - 反垃圾
---

# 验证码显示扩展

通过 `Filter_Plugin_Zbp_ShowValidCode` 接口，可以接管 Z-BlogPHP 的验证码显示。系统默认由 `zb_system/script/c_validcode.php` 调用 `Zbp::ShowValidCode()` 输出图片验证码，挂载本接口后可替换为自己的方案。

## 接口信息

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_ShowValidCode` | `$id` | Zbp 类的显示验证码接口，具有唯一性 |

## 完整案例

下例把默认图片验证码替换为算术题图片，并与 `Filter_Plugin_Zbp_CheckValidCode` 成对接管比对：

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

    // 生成两位数加法题，答案的 md5 写入 Cookie 供比对
    $a = rand(1, 9);
    $b = rand(1, 9);
    $hash_pre = $zbp->guid . $zbp->path;
    setcookie('captcha_' . crc32($zbp->guid . $id), md5($hash_pre . date('YmdH') . ($a + $b)), 0, $zbp->cookiespath);

    // 输出算术题图片
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

    $original = GetVars('captcha_' . crc32($zbp->guid . $id), 'COOKIE');
    setcookie('captcha_' . crc32($zbp->guid . $id), '', time() - 3600, $zbp->cookiespath);

    $answer = strtolower(trim($verifyCode));
    if ($answer == '' || $original == '') {
        return false;
    }

    $hash_pre = $zbp->guid . $zbp->path;
    return $original == md5($hash_pre . date('YmdH') . $answer);
}
```

## 注意事项

- 触发位置在 `Zbp::ShowValidCode()` 内，默认调用点是 `zb_system/script/c_validcode.php`，页面以 `<img>` 方式请求它，因此回调需自行输出图像并结束请求；
- 「唯一性」的含义：核心只取第一个挂载回调的返回值，多个插件同时挂载时只有先注册者生效，替换方案必须与 `Filter_Plugin_Zbp_CheckValidCode` 成对实现；
- 回调实际会收到两个参数：`$id`（命名事件，如登录为 login、评论为 cmt）与 `$timecompare`（hour 或 minute，校验时效粒度）；
- 若不挂载本接口，核心输出默认 GD 图片验证码并把比对值写入 `captcha_*` Cookie；
- 方案需覆盖所有验证码事件 id，否则未覆盖事件的验证码将无法通过比对。
