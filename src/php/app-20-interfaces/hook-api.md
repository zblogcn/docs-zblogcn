## 「API」处理

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_API_Begin` | | API 启动 |
| `Filter_Plugin_API_Dispatch` | `$mods, $mod, $act` | API 分发前 |
| `Filter_Plugin_API_Extend_Mods` | | API 的应用追加模块机制 |
| `Filter_Plugin_API_CheckMods` | `&$mods_allow, &$mods_disallow` | API 的黑白名单机制 |
| `Filter_Plugin_API_Get_Request_Filter` | `&$condition` | API 获取约束过滤条件 |
| `Filter_Plugin_API_Get_Pagination_Info` | `&$info, &$pagebar` | API 获取分页信息 |
| `Filter_Plugin_API_Get_Object_Array` | `&$object, &$array, &$other_props, &$remove_props, &$with_relations` | API 转换 Object 到 Array |
| `Filter_Plugin_API_Post_List_Core` | `&$select, $where, $order, $limit, $option` | 处理 api_post_list 的查询 |
| `Filter_Plugin_API_VerifyCSRF_Skip` | `&$skip_acts` | API 校验 CSRF Token 跳过验证 |
| `Filter_Plugin_API_Result_Data` | `&$result, $mod, $act` | 处理返回数据 |
| `Filter_Plugin_API_Pre_Response` | `&$data, &$error, &$code, &$message` | API 响应处理前接口 |
| `Filter_Plugin_API_Pre_Response_Raw` | `&$raw, &$raw_type` | 处理返回数据 |
| `Filter_Plugin_API_Response` | `&$response` | API 响应内容处理 |
