## 「魔术方法」扩展

### 文章（Post）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Post_Url`](/php/dev-examples/magic/post-url) | `&$this` | 干预 Post 类 Url 方法的接口 |
| [`Filter_Plugin_Post_Get`](/php/dev-examples/magic/post-get) | `&$this, $method` | 干预 Post 类 Get 方法的接口 |
| [`Filter_Plugin_Post_Set`](/php/dev-examples/magic/post-set) | `&$this, $method, $arg` | 干预 Post 类 Set 方法的接口 |
| [`Filter_Plugin_Post_Save`](/php/dev-examples/magic/post-save) | `&$post` | Post 类的 Save 方法接口 |
| [`Filter_Plugin_Post_Del`](/php/dev-examples/magic/post-del) | `&$post` | Post 类的 Del 方法接口 |
| [`Filter_Plugin_Post_Call`](/php/dev-examples/magic/post-call) | `&$post, $method, $args` | Post 类的魔术方法接口 |
| [`Filter_Plugin_Post_Thumbs`](/php/dev-examples/magic/post-thumbs) | `&$this, &$all_images, &$width, &$height, &$count, &$clip` | 干预 Post 类 Thumbs 方法的接口 |
| [`Filter_Plugin_Post_Prev`](/php/dev-examples/magic/post-prev) | `$post` | Post 类的 Prev 接口 |
| [`Filter_Plugin_Post_Next`](/php/dev-examples/magic/post-next) | `$post` | Post 类的 Next 接口 |
| [`Filter_Plugin_Post_RelatedList`](/php/dev-examples/magic/post-related-list) | `$post` | Post 类的 RelatedList 接口 |
| [`Filter_Plugin_Post_CommentPostUrl`](/php/dev-examples/magic/post-comment-post-url) | `$post` | Post 类的 CommentPostUrl 接口 |

### 分类（Category）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Category_Url`](/php/dev-examples/magic/category-url) | `&$this` | 干预 Category 类 Url 方法的接口 |
| [`Filter_Plugin_Category_Get`](/php/dev-examples/magic/category-get) | `&$this, $method` | 干预 Category 类 Get 方法的接口 |
| [`Filter_Plugin_Category_Set`](/php/dev-examples/magic/category-set) | `&$this, $method, $arg` | 干预 Category 类 Set 方法的接口 |
| [`Filter_Plugin_Category_Save`](/php/dev-examples/magic/category-save) | `&$category` | Category 类的 Save 方法接口 |
| [`Filter_Plugin_Category_Del`](/php/dev-examples/magic/category-del) | `&$category` | Category 类的 Del 方法接口 |
| [`Filter_Plugin_Category_Call`](/php/dev-examples/magic/category-call) | `&$category, $method, $args` | Category 类的魔术方法接口 |

### 标签（Tag）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Tag_Url`](/php/dev-examples/magic/tag-url) | `&$this` | 干预 Tag 类 Url 方法的接口 |
| [`Filter_Plugin_Tag_Get`](/php/dev-examples/magic/tag-get) | `&$this, $method` | 干预 Tag 类 Get 方法的接口 |
| [`Filter_Plugin_Tag_Set`](/php/dev-examples/magic/tag-set) | `&$this, $method, $arg` | 干预 Tag 类 Set 方法的接口 |
| [`Filter_Plugin_Tag_Save`](/php/dev-examples/magic/tag-save) | `&$tag` | Tag 类的 Save 方法接口 |
| [`Filter_Plugin_Tag_Del`](/php/dev-examples/magic/tag-del) | `&$tag` | Tag 类的 Del 方法接口 |
| [`Filter_Plugin_Tag_Call`](/php/dev-examples/magic/tag-call) | `&$tag, $method, $args` | Tag 类的魔术方法接口 |

### 用户（Member）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Member_Url`](/php/dev-examples/magic/member-url) | `&$this` | 干预 Member 类 Url 方法的接口 |
| [`Filter_Plugin_Member_Get`](/php/dev-examples/magic/member-get) | `&$this, $method` | 干预 Member 类 Get 方法的接口 |
| [`Filter_Plugin_Member_Set`](/php/dev-examples/magic/member-set) | `&$this, $method, $arg` | 干预 Member 类 Set 方法的接口 |
| [`Filter_Plugin_Member_Save`](/php/dev-examples/magic/member-save) | `&$member` | Member 类的 Save 方法接口 |
| [`Filter_Plugin_Member_Del`](/php/dev-examples/magic/member-del) | `&$member` | Member 类的 Del 方法接口 |
| [`Filter_Plugin_Member_Call`](/php/dev-examples/magic/member-call) | `&$member, $method, $args` | Member 类的魔术方法接口 |
| [`Filter_Plugin_Member_Avatar`](/php/dev-examples/magic/member-avatar) | `$member` | Member 类的 Avatar 接口 |

### 评论（Comment）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Comment_Get`](/php/dev-examples/magic/comment-get) | `&$this, $method` | 干预 Comment 类 Get 方法的接口 |
| [`Filter_Plugin_Comment_Set`](/php/dev-examples/magic/comment-set) | `&$this, $method, $arg` | 干预 Comment 类 Set 方法的接口 |
| [`Filter_Plugin_Comment_Save`](/php/dev-examples/magic/comment-save) | `&$comment` | Comment 类的 Save 方法接口 |
| [`Filter_Plugin_Comment_Del`](/php/dev-examples/magic/comment-del) | `&$comment` | Comment 类的 Del 方法接口 |
| [`Filter_Plugin_Comment_Call`](/php/dev-examples/magic/comment-call) | `&$comment, $method, $args` | Comment 类的魔术方法接口 |

### 模块（Module）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Module_Get`](/php/dev-examples/magic/module-get) | `&$this, $method` | 干预 Module 类 Get 方法的接口 |
| [`Filter_Plugin_Module_Set`](/php/dev-examples/magic/module-set) | `&$this, $method, $arg` | 干预 Module 类 Set 方法的接口 |
| [`Filter_Plugin_Module_Save`](/php/dev-examples/magic/module-save) | `&$module` | Module 类的 Save 方法接口 |
| [`Filter_Plugin_Module_Del`](/php/dev-examples/magic/module-del) | `&$module` | Module 类的 Del 方法接口 |

### 附件（Upload）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Upload_SaveFile`](/php/dev-examples/magic/upload-save-file) | `$tmp, $this` | Upload 类的 SaveFile 方法接口 |
| [`Filter_Plugin_Upload_SaveBase64File`](/php/dev-examples/magic/upload-save-base64-file) | `$str64, $this` | Upload 类的 SaveBase64File 方法接口 |
| [`Filter_Plugin_Upload_Del`](/php/dev-examples/magic/upload-del) | `$this` | Upload 类的 Del 方法接口 |
| [`Filter_Plugin_Upload_DelFile`](/php/dev-examples/magic/upload-del-file) | `$this` | Upload 类的 DelFile 方法接口 |
| [`Filter_Plugin_Upload_Url`](/php/dev-examples/magic/upload-url) | `$upload` | Upload 类的 Url 方法接口 |
| [`Filter_Plugin_Upload_Get`](/php/dev-examples/magic/upload-get) | `&$this, $method` | 干预 Upload 类 Get 方法的接口 |
| [`Filter_Plugin_Upload_Set`](/php/dev-examples/magic/upload-set) | `&$this, $method, $arg` | 干预 Upload 类 Set 方法的接口 |
| [`Filter_Plugin_Upload_Dir`](/php/dev-examples/magic/upload-dir) | `$upload` | Upload 类的 Dir 方法接口 |

### 系统（Zbp）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_Zbp_Call`](/php/dev-examples/magic/zbp-call) | `$method, $args` | Zbp 类的魔术方法接口 |
| [`Filter_Plugin_Zbp_Get`](/php/dev-examples/magic/zbp-get) | `$name` | Zbp 类的魔术方法接口 |
| [`Filter_Plugin_Zbp_Set`](/php/dev-examples/magic/zbp-set) | `$name, $value` | Zbp 类的魔术方法接口 |
| [`Filter_Plugin_Zbp_CheckRights`](/php/dev-examples/magic/zbp-check-rights) | `$action` | Zbp 类的检查权限接口（检查当前用户） |

### 其他

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_GetPost_Result`](/php/dev-examples/magic/get-post-result) | `&$post` | 定义 GetPost 输出结果接口 |
| [`Filter_Plugin_GetList_Result`](/php/dev-examples/magic/get-list-result) | `&$list` | 定义 GetList 输出结果接口 |
| [`Filter_Plugin_App_Pack`](/php/dev-examples/magic/app-pack) | `$this, $this->dirs, $this->files` | App 类的 Pack 方法接口 |
| [`Filter_Plugin_DbSql_Filter`](/php/dev-examples/magic/db-sql-filter) | `$method, $args` | DbSql 类的 SQL 过滤和统计方法接口 |
