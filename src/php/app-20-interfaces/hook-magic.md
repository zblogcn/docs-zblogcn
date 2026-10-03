## 「魔术方法」扩展

### 文章（Post）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Post_Url` | `&$this` | 干预 Post 类 Url 方法的接口 |
| `Filter_Plugin_Post_Get` | `&$this, $method` | 干预 Post 类 Get 方法的接口 |
| `Filter_Plugin_Post_Set` | `&$this, $method, $arg` | 干预 Post 类 Set 方法的接口 |
| `Filter_Plugin_Post_Save` | `&$post` | Post 类的 Save 方法接口 |
| `Filter_Plugin_Post_Del` | `&$post` | Post 类的 Del 方法接口 |
| `Filter_Plugin_Post_Call` | `&$post, $method, $args` | Post 类的魔术方法接口 |
| `Filter_Plugin_Post_Thumbs` | `&$this, &$all_images, &$width, &$height, &$count, &$clip` | 干预 Post 类 Thumbs 方法的接口 |
| `Filter_Plugin_Post_Prev` | `$post` | Post 类的 Prev 接口 |
| `Filter_Plugin_Post_Next` | `$post` | Post 类的 Next 接口 |
| `Filter_Plugin_Post_RelatedList` | `$post` | Post 类的 RelatedList 接口 |
| `Filter_Plugin_Post_CommentPostUrl` | `$post` | Post 类的 CommentPostUrl 接口 |

### 分类（Category）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Category_Url` | `&$this` | 干预 Category 类 Url 方法的接口 |
| `Filter_Plugin_Category_Get` | `&$this, $method` | 干预 Category 类 Get 方法的接口 |
| `Filter_Plugin_Category_Set` | `&$this, $method, $arg` | 干预 Category 类 Set 方法的接口 |
| `Filter_Plugin_Category_Save` | `&$category` | Category 类的 Save 方法接口 |
| `Filter_Plugin_Category_Del` | `&$category` | Category 类的 Del 方法接口 |
| `Filter_Plugin_Category_Call` | `&$category, $method, $args` | Category 类的魔术方法接口 |

### 标签（Tag）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Tag_Url` | `&$this` | 干预 Tag 类 Url 方法的接口 |
| `Filter_Plugin_Tag_Get` | `&$this, $method` | 干预 Tag 类 Get 方法的接口 |
| `Filter_Plugin_Tag_Set` | `&$this, $method, $arg` | 干预 Tag 类 Set 方法的接口 |
| `Filter_Plugin_Tag_Save` | `&$tag` | Tag 类的 Save 方法接口 |
| `Filter_Plugin_Tag_Del` | `&$tag` | Tag 类的 Del 方法接口 |
| `Filter_Plugin_Tag_Call` | `&$tag, $method, $args` | Tag 类的魔术方法接口 |

### 用户（Member）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Member_Url` | `&$this` | 干预 Member 类 Url 方法的接口 |
| `Filter_Plugin_Member_Get` | `&$this, $method` | 干预 Member 类 Get 方法的接口 |
| `Filter_Plugin_Member_Set` | `&$this, $method, $arg` | 干预 Member 类 Set 方法的接口 |
| `Filter_Plugin_Member_Save` | `&$member` | Member 类的 Save 方法接口 |
| `Filter_Plugin_Member_Del` | `&$member` | Member 类的 Del 方法接口 |
| `Filter_Plugin_Member_Call` | `&$member, $method, $args` | Member 类的魔术方法接口 |
| `Filter_Plugin_Member_Avatar` | `$member` | Member 类的 Avatar 接口 |

### 评论（Comment）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Comment_Get` | `&$this, $method` | 干预 Comment 类 Get 方法的接口 |
| `Filter_Plugin_Comment_Set` | `&$this, $method, $arg` | 干预 Comment 类 Set 方法的接口 |
| `Filter_Plugin_Comment_Save` | `&$comment` | Comment 类的 Save 方法接口 |
| `Filter_Plugin_Comment_Del` | `&$comment` | Comment 类的 Del 方法接口 |
| `Filter_Plugin_Comment_Call` | `&$comment, $method, $args` | Comment 类的魔术方法接口 |

### 模块（Module）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Module_Get` | `&$this, $method` | 干预 Module 类 Get 方法的接口 |
| `Filter_Plugin_Module_Set` | `&$this, $method, $arg` | 干预 Module 类 Set 方法的接口 |
| `Filter_Plugin_Module_Save` | `&$module` | Module 类的 Save 方法接口 |
| `Filter_Plugin_Module_Del` | `&$module` | Module 类的 Del 方法接口 |

### 附件（Upload）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Upload_SaveFile` | `$tmp, $this` | Upload 类的 SaveFile 方法接口 |
| `Filter_Plugin_Upload_SaveBase64File` | `$str64, $this` | Upload 类的 SaveBase64File 方法接口 |
| `Filter_Plugin_Upload_Del` | `$this` | Upload 类的 Del 方法接口 |
| `Filter_Plugin_Upload_DelFile` | `$this` | Upload 类的 DelFile 方法接口 |
| `Filter_Plugin_Upload_Url` | `$upload` | Upload 类的 Url 方法接口 |
| `Filter_Plugin_Upload_Get` | `&$this, $method` | 干预 Upload 类 Get 方法的接口 |
| `Filter_Plugin_Upload_Set` | `&$this, $method, $arg` | 干预 Upload 类 Set 方法的接口 |
| `Filter_Plugin_Upload_Dir` | `$upload` | Upload 类的 Dir 方法接口 |

### 系统（Zbp）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_Zbp_Call` | `$method, $args` | Zbp 类的魔术方法接口 |
| `Filter_Plugin_Zbp_Get` | `$name` | Zbp 类的魔术方法接口 |
| `Filter_Plugin_Zbp_Set` | `$name, $value` | Zbp 类的魔术方法接口 |
| `Filter_Plugin_Zbp_CheckRights` | `$action` | Zbp 类的检查权限接口（检查当前用户） |

### 其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_GetPost_Result` | `&$post` | 定义 GetPost 输出结果接口 |
| `Filter_Plugin_GetList_Result` | `&$list` | 定义 GetList 输出结果接口 |
| `Filter_Plugin_App_Pack` | `$this, $this->dirs, $this->files` | App 类的 Pack 方法接口 |
| `Filter_Plugin_DbSql_Filter` | `$method, $args` | DbSql 类的 SQL 过滤和统计方法接口 |
