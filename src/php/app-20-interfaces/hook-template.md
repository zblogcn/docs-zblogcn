## 「模板」处理

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Template_Compiling_Begin` | `$this, $content` | Template 类编译一个模板前的接口 |
| `Filter_Plugin_Template_Compiling_End` | `$this, $content` | Template 类编译一个模板后的接口 |
| `Filter_Plugin_Template_GetTemplate` | `$this, $name` | Template 类读取一个模板前的接口 |
| `Filter_Plugin_Template_Display` | `$this, $entryPage` | Template 类显示接口 |
| `Filter_Plugin_Zbp_BuildTemplate` | `$template` | Zbp 类的重新编译模板接口 |
| `Filter_Plugin_Zbp_MakeTemplatetags` | `$template` | Zbp 类的生成模板标签接口 |
| `Filter_Plugin_Zbp_BuildModule` | | Zbp 类的生成模块内容的接口 |
| `Filter_Plugin_Zbp_RegBuildModules` | | Zbp 类的注册模块时的接口 |
| `Filter_Plugin_Zbp_PrepareTemplate` | `&$theme, &$template_dirname` | Zbp 类的 PrepareTemplate 接口 |
| `Filter_Plugin_Html_Js_Add` | | c_html_js_add.php 脚本接口，允许插件在 c_html_js_add.php 内输出内容 |
| `Filter_Plugin_Html_Js_ZbpConfig` | | c_html_js_add.php 脚本接口，允许插件设置 zbpConfig |
| `Filter_Plugin_Admin_Js_Add` | | c_admin_js_add.php 脚本页的接口 |
| `Filter_Plugin_ViewExternalLink_Template` | `&$template` | 定义 ViewExternalLink 输出模板接口 |
| `Filter_Plugin_OutputOptionItemsOfMemberLevel` | `$default, $tz` | 定义 OutputOptionItemsOfMemberLevel 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfMember_Begin` | `$default, $posttype, $action, $tz` | 定义 OutputOptionItemsOfMember 函数里的前置接口 |
| `Filter_Plugin_OutputOptionItemsOfCategories` | `$default, $tz` | 定义 OutputOptionItemsOfCategories 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfPostStatus` | `$default, $tz` | 定义 OutputOptionItemsOfPostStatus 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfIsTop` | `$default, $tz` | 定义 OutputOptionItemsOfIsTop 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfMember` | `$default, $tz` | 定义 OutputOptionItemsOfMember 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfTemplate` | `$default, $tz` | 定义 OutputOptionItemsOfTemplate 函数里的接口 |
| `Filter_Plugin_OutputOptionItemsOfCommon` | `$default, $array, $name` | 定义 OutputOptionItemsOfCommon 函数里的接口，因为是通用型的，所以有 $name |
