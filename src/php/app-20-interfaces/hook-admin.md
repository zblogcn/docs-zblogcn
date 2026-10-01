## 「管理页面」输出

### 后台全局输出

| 接口                         | 参数             | 说明                           |
| ---------------------------- | ---------------- | ------------------------------ |
| Filter_Plugin_Admin_Header   |                  | 用于向后台「header」输出内容   |
| Filter_Plugin_Admin_Footer   |                  | 用于向后台「footer」输出内容   |
| Filter_Plugin_Admin_TopMenu  | `arr $topmenus`  | 用于向后台「顶部菜单」添加项目 |
| Filter_Plugin_Admin_LeftMenu | `arr $leftmenus` | 用于向后台「侧栏菜单」添加项目 |

<details>
<summary>接口示例（点击展开）</summary>

```php
function ActivePlugin_demoAPP() {
  Add_Filter_Plugin('Filter_Plugin_Admin_Header','demoAPP_Admin_Header');
  Add_Filter_Plugin('Filter_Plugin_Admin_TopMenu','demoAPP_Admin_TopMenu');
}
function demoAPP_Admin_Header()
{
  global $zbp;
  echo '<script src="' . $zbp->host . 'zb_users/plugin/demoAPP/script/plugin.js"></script>';
  echo '<style type="text/css">#divMain2 {margin-bottom: 6rem;}</style>';
}
function demoAPP_Admin_TopMenu(&$topmenus)
{
  global $zbp;
  $topmenus[] = MakeTopMenu("root", "demoAPP管理", $zbp->host . "zb_users/plugin/demoAPP/main.php", "", "");
}
// Filter_Plugin_Admin_Footer 和 Filter_Plugin_Admin_LeftMenu 同理；
// 对应有 MakeLeftMenu() 函数可用
```

</details>

### 特定页 菜单管理 SubMenu

用法示例详见「[后台子菜单扩展案例](/php/dev-examples/submenu/)」。

| 接口                                    | 参数 | 说明 |
| --------------------------------------- | ---- | ---- |
| [Filter_Plugin_Admin_SiteInfo_SubMenu](/php/dev-examples/submenu/site-info)    |      | 后台首页页面子菜单   |
| [Filter_Plugin_Admin_ArticleMng_SubMenu](/php/dev-examples/submenu/article-mng)  |      | 文章管理页面子菜单   |
| [Filter_Plugin_Admin_PageMng_SubMenu](/php/dev-examples/submenu/page-mng)     |      | 页面管理页面子菜单   |
| [Filter_Plugin_Admin_CategoryMng_SubMenu](/php/dev-examples/submenu/category-mng) |      | 分类管理页面子菜单   |
| [Filter_Plugin_Admin_CommentMng_SubMenu](/php/dev-examples/submenu/comment-mng)  |      | 评论管理页面子菜单   |
| [Filter_Plugin_Admin_MemberMng_SubMenu](/php/dev-examples/submenu/member-mng)   |      | 用户管理页面子菜单   |
| [Filter_Plugin_Admin_UploadMng_SubMenu](/php/dev-examples/submenu/upload-mng)   |      | 附件管理页面子菜单   |
| [Filter_Plugin_Admin_TagMng_SubMenu](/php/dev-examples/submenu/tag-mng)      |      | 标签管理页面子菜单   |
| [Filter_Plugin_Admin_PluginMng_SubMenu](/php/dev-examples/submenu/plugin-mng)   |      | 插件管理页面子菜单   |
| [Filter_Plugin_Admin_ThemeMng_SubMenu](/php/dev-examples/submenu/theme-mng)    |      | 主题管理页面子菜单   |
| [Filter_Plugin_Admin_ModuleMng_SubMenu](/php/dev-examples/submenu/module-mng)   |      | 模块管理页面子菜单   |
| [Filter_Plugin_Admin_SettingMng_SubMenu](/php/dev-examples/submenu/setting-mng)  |      | 设置管理页面子菜单   |
| [Filter_Plugin_Edit_SubMenu](/php/dev-examples/submenu/edit)              |      | 编辑页菜单          |
| [Filter_Plugin_Tag_Edit_SubMenu](/php/dev-examples/submenu/tag-edit)          |      | 标签编辑页菜单       |
| [Filter_Plugin_Module_Edit_SubMenu](/php/dev-examples/submenu/module-edit)       |      | 模块编辑页菜单       |
| [Filter_Plugin_Member_Edit_SubMenu](/php/dev-examples/submenu/member-edit)       |      | 用户编辑页菜单       |
| [Filter_Plugin_Category_Edit_SubMenu](/php/dev-examples/submenu/category-edit)     |      | 分类编辑页菜单       |

### 特定页表格过滤

| 接口                                  | 参数 | 说明 |
| ------------------------------------- | ---- | ---- |
| Filter_Plugin_Admin_ArticleMng_Table  | `arr $article arr $tabletds arr $tableths` | 文章管理页表处理
| Filter_Plugin_Admin_PageMng_Table     |
| Filter_Plugin_Admin_CategoryMng_Table |
| Filter_Plugin_Admin_CommentMng_Table  |
| Filter_Plugin_Admin_MemberMng_Table   |
| Filter_Plugin_Admin_UploadMng_Table   |
| Filter_Plugin_Admin_TagMng_Table      |

### 特定页输出

| 接口                                 | 参数 | 说明 |
| ------------------------------------ | ---- | ---- |
| Filter_Plugin_Edit_Begin             |
| Filter_Plugin_Edit_End               |
| Filter_Plugin_Edit_Response          |
| Filter_Plugin_Edit_Response2         |
| Filter_Plugin_Edit_Response4         |
| Filter_Plugin_Edit_Response5         |
| Filter_Plugin_Edit_Response3         |
| Filter_Plugin_Category_Edit_Response |
| Filter_Plugin_Tag_Edit_Response      |
| Filter_Plugin_Member_Edit_Response   |
| Filter_Plugin_Module_Edit_Response   |

## 「管理页面」流程监听

| 接口                      | 参数 | 说明 |
| ------------------------- | ---- | ---- |
| Filter_Plugin_Admin_Begin |
| Filter_Plugin_Admin_End   |

