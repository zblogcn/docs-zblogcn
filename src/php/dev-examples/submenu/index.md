---
title: Z-BlogPHP 后台子菜单扩展案例
description: 介绍 Z-BlogPHP 插件通过 Filter_Plugin_Admin_*_SubMenu 系列接口向后台各管理页面添加子菜单的方法，包含 MakeSubMenu 辅助函数用法与 17 个页面的完整插件案例。
---

# 后台子菜单扩展案例

Z-BlogPHP 的后台管理页面（文章管理、页面管理、分类管理等）顶部都有一排子菜单，例如「新增文章」「新增页面」。插件可以通过 `Filter_Plugin_Admin_*_SubMenu` 系列接口在这些页面追加自定义子菜单项。

## 通用模式

所有 SubMenu 接口的用法相同：

1. 在插件的 `ActivePlugin_*` 函数中，通过 `Add_Filter_Plugin()` 注册回调函数
2. 回调函数在后台页面渲染时被调用，需要 `echo` 输出一段 HTML（通常是 `<a>` 标签）
3. 推荐用数组集中定义菜单项，再通过 `MakeSubMenu()` 循环输出，菜单较多或需要调整顺序时更方便

```php
function ActivePlugin_demoAPP()
{
    Add_Filter_Plugin('Filter_Plugin_Admin_XXX_SubMenu', 'demoAPP_XXX_SubMenu');
}

function demoAPP_XXX_SubMenu()
{
    global $zbp;
    // 每项参数依次为：名称、链接、CSS 类名、target（新窗口填 _blank，否则留空）
    $array   = [];
    $array[] = ['菜单一', $zbp->host . 'zb_users/plugin/demoAPP/main.php',         'm-left', ''];
    $array[] = ['菜单二', $zbp->host . 'zb_users/plugin/demoAPP/main.php?act=two', 'm-left', '_blank'];
    foreach ($array as list($name, $url, $class, $target)) {
        echo MakeSubMenu($name, $url, $class, $target);
    }
}
```

### MakeSubMenu 参数

```php
function MakeSubMenu(
    $strName,           // 菜单显示文字
    $strUrl,            // 链接地址
    $strClass = 'm-left',     // 可选，CSS 类名
    $strTarget = '',           // 可选，target 属性
    $strId = '',               // 可选，id 属性
    $strTitle = '',            // 可选，title 和 alt 属性
    $strIconClass = ''         // 可选，图标类名
)
```

### 注意事项

- 回调函数必须 **`echo`** 输出 HTML，而不是 `return`；
- 菜单项的 `<span>` 建议使用 `m-left` 类名，保持与系统内置菜单样式一致；
- 如果需要根据当前页面条件决定是否显示，可以在回调里用 `GetVars('act', 'GET')` 判断当前 `act` 参数。

## 各页面案例

### 管理页面子菜单

| 接口 | 页面 | 案例 |
| --- | --- | --- |
| Filter_Plugin_Admin_SiteInfo_SubMenu | 后台首页 | [快捷操作面板](./site-info) |
| Filter_Plugin_Admin_ArticleMng_SubMenu | 文章管理 | [批量生成文章](./article-mng) |
| Filter_Plugin_Admin_PageMng_SubMenu | 页面管理 | [批量创建页面](./page-mng) |
| Filter_Plugin_Admin_CategoryMng_SubMenu | 分类管理 | [分类合并工具](./category-mng) |
| Filter_Plugin_Admin_CommentMng_SubMenu | 评论管理 | [评论过滤](./comment-mng) |
| Filter_Plugin_Admin_MemberMng_SubMenu | 用户管理 | [批量导出用户](./member-mng) |
| Filter_Plugin_Admin_UploadMng_SubMenu | 附件管理 | [附件清理工具](./upload-mng) |
| Filter_Plugin_Admin_TagMng_SubMenu | 标签管理 | [标签合并](./tag-mng) |
| Filter_Plugin_Admin_PluginMng_SubMenu | 插件管理 | [插件设置快捷入口](./plugin-mng) |
| Filter_Plugin_Admin_ThemeMng_SubMenu | 主题管理 | [主题备份](./theme-mng) |
| Filter_Plugin_Admin_ModuleMng_SubMenu | 模块管理 | [模块批量编辑](./module-mng) |
| Filter_Plugin_Admin_SettingMng_SubMenu | 设置管理 | [高级设置](./setting-mng) |

### 编辑页子菜单

| 接口 | 页面 | 案例 |
| --- | --- | --- |
| Filter_Plugin_Edit_SubMenu | 文章/页面编辑页 | [自定义编辑按钮](./edit) |
| Filter_Plugin_Tag_Edit_SubMenu | 标签编辑页 | [标签高级属性](./tag-edit) |
| Filter_Plugin_Module_Edit_SubMenu | 模块编辑页 | [模块高级设置](./module-edit) |
| Filter_Plugin_Member_Edit_SubMenu | 用户编辑页 | [用户扩展字段](./member-edit) |
| Filter_Plugin_Category_Edit_SubMenu | 分类编辑页 | [分类扩展属性](./category-edit) |
