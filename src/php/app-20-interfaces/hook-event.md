## 「流程/事件」监听

### 指令提交

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Cmd_Begin`](/php/dev-examples/event/cmd-begin) | | cmd.php 的启动接口，可以在这里拦截各种 action |
| [`Filter_Plugin_Cmd_End`](/php/dev-examples/event/cmd-end) | | cmd.php 的结束接口，可以在这里拦截各种 action 之后的处理 |
| [`Filter_Plugin_Cmd_Ajax`](/php/dev-examples/event/cmd-ajax) | | cmd.php 的 Ajax 命令专用接口，插件需要自行判断权限 |
| [`Filter_Plugin_Cmd_Redirect`](/php/dev-examples/event/cmd-redirect) | `$url, $action` | cmd.php 的最后跳转接口，用于修改 url 跳转值 |
| [`Filter_Plugin_Misc_Begin`](/php/dev-examples/event/misc-begin) | `$type` | c_system_misc.php 的启动接口，可以在这里拦截各种 type |

### 登录验证

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_VerifyLogin_Succeed`](/php/dev-examples/event/verify-login-succeed) | | VerifyLogin 成功的接口 |
| [`Filter_Plugin_VerifyLogin_Failed`](/php/dev-examples/event/verify-login-failed) | | VerifyLogin 失败的接口 |
| [`Filter_Plugin_Logout_Succeed`](/php/dev-examples/event/logout-succeed) | | Logout 成功的接口 |
| [`Filter_Plugin_Login_Header`](/php/dev-examples/event/login-header) | | 定义 Login.php 首页 header 接口 |
| [`Filter_Plugin_Other_Header`](/php/dev-examples/event/other-header) | | 定义其它页的 header 接口 |

### 系统加载

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Zbp_PreLoad`](/php/dev-examples/event/zbp-pre-load) | | Zbp 类的预加载接口 |
| [`Filter_Plugin_Zbp_Load`](/php/dev-examples/event/zbp-load) | | Zbp 类的加载接口 |
| [`Filter_Plugin_Zbp_Load_Pre`](/php/dev-examples/event/zbp-load-pre) | | Zbp 类的加载（预处理）接口 |
| [`Filter_Plugin_Zbp_LoadManage`](/php/dev-examples/event/zbp-load-manage) | | Zbp 类的后台管理初始加载接口 |
| [`Filter_Plugin_Zbp_CheckSiteClosed`](/php/dev-examples/event/zbp-check-site-closed) | | Zbp 类的跳出关站检查接口 |
| [`Filter_Plugin_Zbp_Terminate`](/php/dev-examples/event/zbp-terminate) | | Zbp 类的终结接口 |
| [`Filter_Plugin_Zbp_ShowError`](/php/dev-examples/event/zbp-show-error) | | 1.7.3 已废弃，请使用 `Filter_Plugin_Debug_Handler_Common` 接口，参数不变 |
| [`Filter_Plugin_Zbp_ShowValidCode`](/php/dev-examples/event/zbp-show-valid-code) | `$id` | Zbp 类的显示验证码接口，具有唯一性 |
| [`Filter_Plugin_Zbp_CheckValidCode`](/php/dev-examples/event/zbp-check-valid-code) | `$vaidcode, $id` | Zbp 类的比对验证码接口，具有唯一性 |

### 调试与日志

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Debug_Handler`](/php/dev-examples/event/debug-handler) | | 1.7.3 已废弃，不应再使用 |
| [`Filter_Plugin_Debug_Handler_ZEE`](/php/dev-examples/event/debug-handler-zee) | `$zee, $debug_type` | 定义 Debug_Exception_Handler、Debug_Error_Handler 函数的接口 |
| [`Filter_Plugin_Debug_Handler_Common`](/php/dev-examples/event/debug-handler-common) | `int $errno, string $errstr, string $errfile, int $errline` | 这是 `Filter_Plugin_Zbp_ShowError` 接口的替代品，无须改动插件函数的参数 |
| [`Filter_Plugin_Debug_Display`](/php/dev-examples/event/debug-display) | `$zec` | 定义 ZBlogException 的 Display 函数的接口（与 Handler 不同的是一个传入 zbp 异常类一个是控制类） |
| [`Filter_Plugin_Autoload`](/php/dev-examples/event/autoload) | `$classname` | 监控 autoload 魔术方法 |
| [`Filter_Plugin_Logs`](/php/dev-examples/event/logs) | `$s, $iserror` | 监控记录函数 |
| [`Filter_Plugin_Http_Request_Convert_To_Global`](/php/dev-examples/event/http-request-convert-to-global) | `$request` | http_request_convert_to_global 函数 |

### 应用管理

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_EnablePlugin`](/php/dev-examples/event/enable-plugin) | `&$name` | EnablePlugin（1.6.0 加入） |
| [`Filter_Plugin_DisablePlugin`](/php/dev-examples/event/disable-plugin) | `&$name` | DisablePlugin（1.6.0 加入） |
| [`Filter_Plugin_BatchPost`](/php/dev-examples/event/batch-post) | `&$type` | BatchPost（1.6.1 加入） |

### 其他入口

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Xmlrpc_Begin`](/php/dev-examples/event/xmlrpc-begin) | `&$xml` | xml-rpc 页的 begin 接口（1.5.1 加入） |
| [`Filter_Plugin_CSP_Backend`](/php/dev-examples/event/csp-backend) | `&$xml` | 后台 CSP 接口（1.5.2 加入） |

### 大数据

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_LargeData_Article`](/php/dev-examples/event/large-data-article) | `&$select, &$where, &$order, &$limit, &$option` | 大数据文章接口 |
| [`Filter_Plugin_LargeData_Page`](/php/dev-examples/event/large-data-page) | `&$select, &$where, &$order, &$limit, &$option` | 大数据页面接口 |
| [`Filter_Plugin_LargeData_Comment`](/php/dev-examples/event/large-data-comment) | `&$select, &$where, &$order, &$limit, &$option` | 大数据评论接口 |
| [`Filter_Plugin_LargeData_CountTagArray`](/php/dev-examples/event/large-data-count-tag-array) | `$string, $plus, $articleid` | 大数据增减文章标签关联表 |
| [`Filter_Plugin_LargeData_GetList`](/php/dev-examples/event/large-data-get-list) | `&$select, &$where, &$order, &$limit, &$option` | 大数据 GetList 函数 |

### 后台其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Admin_Hint`](/php/dev-examples/event/admin-hint) | | 定义后台首页 hint 接口 |
| [`Filter_Plugin_Admin_Other_Action`](/php/dev-examples/event/admin-other-action) | | 后台管理页拦截后台管理请求实现自己的 Action |

### 前台其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_ViewPost_ViewNums`](/php/dev-examples/event/view-post-view-nums) | `&$article` | 定义 ViewPost 浏览数接口 |
| [`Filter_Plugin_ViewPost_Begin_V2`](/php/dev-examples/event/view-post-begin-v2) | `&$array` | 定义 POST 显示输出 begin 接口（第 2 版，只传入一个 $array） |
| [`Filter_Plugin_ViewList_Begin_V2`](/php/dev-examples/event/view-list-begin-v2) | `&$array` | 定义列表输出接口（第 2 版，只传一个 $array） |
