## 「数据写入」处理

### 提交前过滤（Core）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostArticle_Core` | `&$article` | 文章编辑的核心接口 |
| `Filter_Plugin_PostPage_Core` | `&$article` | 页面编辑的核心接口 |
| `Filter_Plugin_PostComment_Core` | `&$cmt` | 评论发表的核心接口 |
| `Filter_Plugin_PostCategory_Core` | `&$cate` | 分类编辑的核心接口 |
| `Filter_Plugin_PostTag_Core` | `&$tag` | 标签编辑的核心接口 |
| `Filter_Plugin_PostMember_Core` | `&$mem` | 会员编辑的核心接口 |
| `Filter_Plugin_PostModule_Core` | `&$mod` | 模块编辑的核心接口 |
| `Filter_Plugin_CheckComment_Core` | `&$cmt` | 评论审核的核心接口 |
| `Filter_Plugin_PostPost_Core` | `&$post` | Post 类对象的通用编辑的核心接口（1.7.0 加入） |
| `Filter_Plugin_DelPost_Core` | `&$post` | Post 类对象的通用删除核心接口（1.7.0 加入） |

### 提交后处理（Succeed）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| `Filter_Plugin_PostArticle_Succeed` | `&$article` | 文章编辑成功的接口 |
| `Filter_Plugin_PostPage_Succeed` | `&$article` | 页面编辑成功的接口 |
| `Filter_Plugin_PostComment_Succeed` | `&$cmt` | 评论发表成功的接口 |
| `Filter_Plugin_PostCategory_Succeed` | `&$cate` | 分类编辑成功的接口 |
| `Filter_Plugin_PostTag_Succeed` | `&$tag` | 标签编辑成功的接口 |
| `Filter_Plugin_PostMember_Succeed` | `&$mem` | 会员编辑成功的接口 |
| `Filter_Plugin_PostModule_Succeed` | `&$mod` | 模块编辑成功的接口 |
| `Filter_Plugin_PostUpload_Succeed` | `&$upload` | 附件上传成功的接口 |
| `Filter_Plugin_CheckComment_Succeed` | `&$cmt` | 评论审核成功的接口 |
| `Filter_Plugin_PostPost_Succeed` | `&$post` | Post 类对象的通用编辑的成功接口（1.7.0 加入） |
| `Filter_Plugin_DelPost_Succeed` | `&$post` | Post 类对象的通用删除成功接口（1.7.0 加入） |
| `Filter_Plugin_DelArticle_Succeed` | `&$article` | 文章删除成功的接口 |
| `Filter_Plugin_DelPage_Succeed` | `&$article` | 页面删除成功的接口 |
| `Filter_Plugin_DelCategory_Succeed` | `&$cate` | 分类删除成功的接口 |
| `Filter_Plugin_DelTag_Succeed` | `&$tag` | 标签删除成功的接口 |
| `Filter_Plugin_DelComment_Succeed` | `&$cmt` | 评论删除成功的接口 |
| `Filter_Plugin_DelMember_Succeed` | `&$mem` | 会员删除成功的接口 |
| `Filter_Plugin_DelModule_Succeed` | `&$mod` | 模块删除成功的接口 |
