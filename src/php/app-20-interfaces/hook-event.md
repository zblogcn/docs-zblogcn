## 「流程/事件」监听

### 指令提交

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Cmd_Begin` | | cmd.php 的启动接口，可以在这里拦截各种 action |
| `Filter_Plugin_Cmd_End` | | cmd.php 的结束接口，可以在这里拦截各种 action 之后的处理 |
| `Filter_Plugin_Cmd_Ajax` | | cmd.php 的 Ajax 命令专用接口，插件需要自行判断权限 |
| `Filter_Plugin_Cmd_Redirect` | `$url, $action` | cmd.php 的最后跳转接口，用于修改 url 跳转值 |
| `Filter_Plugin_Misc_Begin` | `$type` | c_system_misc.php 的启动接口，可以在这里拦截各种 type |

### 登录验证

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_VerifyLogin_Succeed` | | VerifyLogin 成功的接口 |
| `Filter_Plugin_VerifyLogin_Failed` | | VerifyLogin 失败的接口 |
| `Filter_Plugin_Logout_Succeed` | | Logout 成功的接口 |
| `Filter_Plugin_Login_Header` | | 定义 Login.php 首页 header 接口 |
| `Filter_Plugin_Other_Header` | | 定义其它页的 header 接口 |

### 系统加载

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_PreLoad` | | Zbp 类的预加载接口 |
| `Filter_Plugin_Zbp_Load` | | Zbp 类的加载接口 |
| `Filter_Plugin_Zbp_Load_Pre` | | Zbp 类的加载（预处理）接口 |
| `Filter_Plugin_Zbp_LoadManage` | | Zbp 类的后台管理初始加载接口 |
| `Filter_Plugin_Zbp_CheckSiteClosed` | | Zbp 类的跳出关站检查接口 |
| `Filter_Plugin_Zbp_Terminate` | | Zbp 类的终结接口 |
| `Filter_Plugin_Zbp_ShowError` | | 1.7.3 已废弃，请使用 `Filter_Plugin_Debug_Handler_Common` 接口，参数不变 |
| `Filter_Plugin_Zbp_ShowValidCode` | `$id` | Zbp 类的显示验证码接口，具有唯一性 |
| `Filter_Plugin_Zbp_CheckValidCode` | `$vaidcode, $id` | Zbp 类的比对验证码接口，具有唯一性 |

### 调试与日志

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Debug_Handler` | | 1.7.3 已废弃，不应再使用 |
| `Filter_Plugin_Debug_Handler_ZEE` | `$zee, $debug_type` | 定义 Debug_Exception_Handler、Debug_Error_Handler 函数的接口 |
| `Filter_Plugin_Debug_Handler_Common` | `int $errno, string $errstr, string $errfile, int $errline` | 这是 `Filter_Plugin_Zbp_ShowError` 接口的替代品，无须改动插件函数的参数 |
| `Filter_Plugin_Debug_Display` | `$zec` | 定义 ZBlogException 的 Display 函数的接口（与 Handler 不同的是一个传入 zbp 异常类一个是控制类） |
| `Filter_Plugin_Autoload` | `$classname` | 监控 autoload 魔术方法 |
| `Filter_Plugin_Logs` | `$s, $iserror` | 监控记录函数 |
| `Filter_Plugin_Http_Request_Convert_To_Global` | `$request` | http_request_convert_to_global 函数 |

### 应用管理

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_EnablePlugin` | `&$name` | EnablePlugin（1.6.0 加入） |
| `Filter_Plugin_DisablePlugin` | `&$name` | DisablePlugin（1.6.0 加入） |
| `Filter_Plugin_BatchPost` | `&$type` | BatchPost（1.6.1 加入） |

### 其他入口

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Xmlrpc_Begin` | `&$xml` | xml-rpc 页的 begin 接口（1.5.1 加入） |
| `Filter_Plugin_CSP_Backend` | `&$xml` | 后台 CSP 接口（1.5.2 加入） |

### 大数据

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_LargeData_Article` | `&$select, &$where, &$order, &$limit, &$option` | 大数据文章接口 |
| `Filter_Plugin_LargeData_Page` | `&$select, &$where, &$order, &$limit, &$option` | 大数据页面接口 |
| `Filter_Plugin_LargeData_Comment` | `&$select, &$where, &$order, &$limit, &$option` | 大数据评论接口 |
| `Filter_Plugin_LargeData_CountTagArray` | `$string, $plus, $articleid` | 大数据增减文章标签关联表 |
| `Filter_Plugin_LargeData_GetList` | `&$select, &$where, &$order, &$limit, &$option` | 大数据 GetList 函数 |

### 后台其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Admin_Hint` | | 定义后台首页 hint 接口 |
| `Filter_Plugin_Admin_Other_Action` | | 后台管理页拦截后台管理请求实现自己的 Action |

### 前台其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_ViewPost_ViewNums` | `&$article` | 定义 ViewPost 浏览数接口 |
| `Filter_Plugin_ViewPost_Begin_V2` | `&$array` | 定义 POST 显示输出 begin 接口（第 2 版，只传入一个 $array） |
| `Filter_Plugin_ViewList_Begin_V2` | `&$array` | 定义列表输出接口（第 2 版，只传一个 $array） |
