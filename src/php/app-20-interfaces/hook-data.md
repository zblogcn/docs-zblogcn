## 「数据写入」处理

### 提交前过滤（Core）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_PostArticle_Core`](/php/dev-examples/data/post-article-core.md) | `&$article` | 文章编辑的核心接口 |
| [`Filter_Plugin_PostPage_Core`](/php/dev-examples/data/post-page-core.md) | `&$article` | 页面编辑的核心接口 |
| [`Filter_Plugin_PostComment_Core`](/php/dev-examples/data/post-comment-core.md) | `&$cmt` | 评论发表的核心接口 |
| [`Filter_Plugin_PostCategory_Core`](/php/dev-examples/data/post-category-core.md) | `&$cate` | 分类编辑的核心接口 |
| [`Filter_Plugin_PostTag_Core`](/php/dev-examples/data/post-tag-core.md) | `&$tag` | 标签编辑的核心接口 |
| [`Filter_Plugin_PostMember_Core`](/php/dev-examples/data/post-member-core.md) | `&$mem` | 会员编辑的核心接口 |
| [`Filter_Plugin_PostModule_Core`](/php/dev-examples/data/post-module-core.md) | `&$mod` | 模块编辑的核心接口 |
| [`Filter_Plugin_CheckComment_Core`](/php/dev-examples/data/check-comment-core.md) | `&$cmt` | 评论审核的核心接口 |
| [`Filter_Plugin_PostPost_Core`](/php/dev-examples/data/post-post-core.md) | `&$post` | Post 类对象的通用编辑的核心接口（1.7.0 加入） |
| [`Filter_Plugin_DelPost_Core`](/php/dev-examples/data/del-post-core.md) | `&$post` | Post 类对象的通用删除核心接口（1.7.0 加入） |

### 提交后处理（Succeed）

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [`Filter_Plugin_PostArticle_Succeed`](/php/dev-examples/data/post-article-succeed.md) | `&$article` | 文章编辑成功的接口 |
| [`Filter_Plugin_PostPage_Succeed`](/php/dev-examples/data/post-page-succeed.md) | `&$article` | 页面编辑成功的接口 |
| [`Filter_Plugin_PostComment_Succeed`](/php/dev-examples/data/post-comment-succeed.md) | `&$cmt` | 评论发表成功的接口 |
| [`Filter_Plugin_PostCategory_Succeed`](/php/dev-examples/data/post-category-succeed.md) | `&$cate` | 分类编辑成功的接口 |
| [`Filter_Plugin_PostTag_Succeed`](/php/dev-examples/data/post-tag-succeed.md) | `&$tag` | 标签编辑成功的接口 |
| [`Filter_Plugin_PostMember_Succeed`](/php/dev-examples/data/post-member-succeed.md) | `&$mem` | 会员编辑成功的接口 |
| [`Filter_Plugin_PostModule_Succeed`](/php/dev-examples/data/post-module-succeed.md) | `&$mod` | 模块编辑成功的接口 |
| [`Filter_Plugin_PostUpload_Succeed`](/php/dev-examples/data/post-upload-succeed.md) | `&$upload` | 附件上传成功的接口 |
| [`Filter_Plugin_CheckComment_Succeed`](/php/dev-examples/data/check-comment-succeed.md) | `&$cmt` | 评论审核成功的接口 |
| [`Filter_Plugin_PostPost_Succeed`](/php/dev-examples/data/post-post-succeed.md) | `&$post` | Post 类对象的通用编辑的成功接口（1.7.0 加入） |
| [`Filter_Plugin_DelPost_Succeed`](/php/dev-examples/data/del-post-succeed.md) | `&$post` | Post 类对象的通用删除成功接口（1.7.0 加入） |
| [`Filter_Plugin_DelArticle_Succeed`](/php/dev-examples/data/del-article-succeed.md) | `&$article` | 文章删除成功的接口 |
| [`Filter_Plugin_DelPage_Succeed`](/php/dev-examples/data/del-page-succeed.md) | `&$article` | 页面删除成功的接口 |
| [`Filter_Plugin_DelCategory_Succeed`](/php/dev-examples/data/del-category-succeed.md) | `&$cate` | 分类删除成功的接口 |
| [`Filter_Plugin_DelTag_Succeed`](/php/dev-examples/data/del-tag-succeed.md) | `&$tag` | 标签删除成功的接口 |
| [`Filter_Plugin_DelComment_Succeed`](/php/dev-examples/data/del-comment-succeed.md) | `&$cmt` | 评论删除成功的接口 |
| [`Filter_Plugin_DelMember_Succeed`](/php/dev-examples/data/del-member-succeed.md) | `&$mem` | 会员删除成功的接口 |
| [`Filter_Plugin_DelModule_Succeed`](/php/dev-examples/data/del-module-succeed.md) | `&$mod` | 模块删除成功的接口 |
