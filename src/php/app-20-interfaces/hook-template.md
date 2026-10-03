## 「模板」处理

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Template_Compiling_Begin`](/php/dev-examples/template/template-compiling-begin) | `$this, $content` | Template 类编译一个模板前的接口 |
| [`Filter_Plugin_Template_Compiling_End`](/php/dev-examples/template/template-compiling-end) | `$this, $content` | Template 类编译一个模板后的接口 |
| [`Filter_Plugin_Template_GetTemplate`](/php/dev-examples/template/template-get-template) | `$this, $name` | Template 类读取一个模板前的接口 |
| [`Filter_Plugin_Template_Display`](/php/dev-examples/template/template-display) | `$this, $entryPage` | Template 类显示接口 |
| [`Filter_Plugin_Zbp_BuildTemplate`](/php/dev-examples/template/zbp-build-template) | `$template` | Zbp 类的重新编译模板接口 |
| [`Filter_Plugin_Zbp_MakeTemplatetags`](/php/dev-examples/template/zbp-make-templatetags) | `$template` | Zbp 类的生成模板标签接口 |
| [`Filter_Plugin_Zbp_BuildModule`](/php/dev-examples/template/zbp-build-module) | | Zbp 类的生成模块内容的接口 |
| [`Filter_Plugin_Zbp_RegBuildModules`](/php/dev-examples/template/zbp-reg-build-modules) | | Zbp 类的注册模块时的接口 |
| [`Filter_Plugin_Zbp_PrepareTemplate`](/php/dev-examples/template/zbp-prepare-template) | `&$theme, &$template_dirname` | Zbp 类的 PrepareTemplate 接口 |
| [`Filter_Plugin_Html_Js_Add`](/php/dev-examples/template/html-js-add) | | c_html_js_add.php 脚本接口，允许插件在 c_html_js_add.php 内输出内容 |
| [`Filter_Plugin_Html_Js_ZbpConfig`](/php/dev-examples/template/html-js-zbp-config) | | c_html_js_add.php 脚本接口，允许插件设置 zbpConfig |
| [`Filter_Plugin_Admin_Js_Add`](/php/dev-examples/template/admin-js-add) | | c_admin_js_add.php 脚本页的接口 |
| [`Filter_Plugin_ViewExternalLink_Template`](/php/dev-examples/template/view-external-link-template) | `&$template` | 定义 ViewExternalLink 输出模板接口 |
| [`Filter_Plugin_OutputOptionItemsOfMemberLevel`](/php/dev-examples/template/output-option-items-of-member-level) | `$default, $tz` | 定义 OutputOptionItemsOfMemberLevel 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfMember_Begin`](/php/dev-examples/template/output-option-items-of-member-begin) | `$default, $posttype, $action, $tz` | 定义 OutputOptionItemsOfMember 函数里的前置接口 |
| [`Filter_Plugin_OutputOptionItemsOfCategories`](/php/dev-examples/template/output-option-items-of-categories) | `$default, $tz` | 定义 OutputOptionItemsOfCategories 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfPostStatus`](/php/dev-examples/template/output-option-items-of-post-status) | `$default, $tz` | 定义 OutputOptionItemsOfPostStatus 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfIsTop`](/php/dev-examples/template/output-option-items-of-is-top) | `$default, $tz` | 定义 OutputOptionItemsOfIsTop 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfMember`](/php/dev-examples/template/output-option-items-of-member) | `$default, $tz` | 定义 OutputOptionItemsOfMember 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfTemplate`](/php/dev-examples/template/output-option-items-of-template) | `$default, $tz` | 定义 OutputOptionItemsOfTemplate 函数里的接口 |
| [`Filter_Plugin_OutputOptionItemsOfCommon`](/php/dev-examples/template/output-option-items-of-common) | `$default, $array, $name` | 定义 OutputOptionItemsOfCommon 函数里的接口，因为是通用型的，所以有 $name |
