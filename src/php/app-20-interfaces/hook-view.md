## 「前台页面」输出

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [Filter_Plugin_ViewList_Template](/php/dev-examples/view-template/list) | `Template $template` | 列表页模板渲染前触发 |
| [Filter_Plugin_ViewPost_Template](/php/dev-examples/view-template/post) | `Template $template` | 文章/页面详情页模板渲染前触发 |
| [Filter_Plugin_ViewSearch_Template](/php/dev-examples/view-template/search) | `Template $template` | 搜索结果页模板渲染前触发 |
| [Filter_Plugin_ViewComments_Template](/php/dev-examples/view-template/comments) | `Template $template` | 评论列表（AJAX）模板渲染前触发 |
| [Filter_Plugin_ViewComment_Template](/php/dev-examples/view-template/comment) | `Template $template` | 单条评论（AJAX）模板渲染前触发 |

## 「前台页面」流程

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [Filter_Plugin_Index_Begin](/php/dev-examples/view-flow/index-begin) | | 前台 index.php 启动后触发 |
| [Filter_Plugin_Index_End](/php/dev-examples/view-flow/index-end) | | 前台 index.php 渲染完成后触发 |
| [Filter_Plugin_ViewIndex_Begin](/php/dev-examples/view-flow/view-index-begin) | `str $url` | 首页渲染入口触发 |
| [Filter_Plugin_ViewAuto_Begin](/php/dev-examples/view-flow/view-auto-begin) | `str $inpurl, str $url` | 路由解析开始时触发 |
| [Filter_Plugin_ViewAuto_End](/php/dev-examples/view-flow/view-auto-end) | `str $url` | 路由解析结束时触发 |
| [Filter_Plugin_Feed_Begin](/php/dev-examples/view-flow/feed-begin) | | feed.php 启动后触发 |
| [Filter_Plugin_Feed_End](/php/dev-examples/view-flow/feed-end) | | feed.php 输出完成后触发 |
| [Filter_Plugin_ViewFeed_Begin](/php/dev-examples/view-flow/view-feed-begin) | | RSS 生成开始时触发 |
| [Filter_Plugin_ViewFeed_Core](/php/dev-examples/view-flow/view-feed-core) | `arr $w` | RSS 查询条件组装时触发 |
| [Filter_Plugin_ViewFeed_End](/php/dev-examples/view-flow/view-feed-end) | `obj $rss2` | RSS 对象输出前触发 |
| [Filter_Plugin_ViewList_Begin](/php/dev-examples/view-flow/view-list-begin) | | 列表查询开始时触发 |
| [Filter_Plugin_ViewList_Core](/php/dev-examples/view-flow/view-list-core) | `$type, $page, $category, $author, $datetime, $tag, &$w, &$pagebar, &$list_template` | 列表查询条件组装后触发 |
| [Filter_Plugin_Search_Begin](/php/dev-examples/view-flow/search-begin) | | search.php 启动后触发 |
| [Filter_Plugin_Search_End](/php/dev-examples/view-flow/search-end) | | search.php 渲染完成后触发 |
| [Filter_Plugin_ViewSearch_Begin](/php/dev-examples/view-flow/view-search-begin) | | 搜索页查询开始时触发 |
| [Filter_Plugin_ViewSearch_Core](/php/dev-examples/view-flow/view-search-core) | `$q, $page, &$w, &$pagebar, &$order` | 搜索查询条件组装后触发 |
| [Filter_Plugin_ViewPost_Begin](/php/dev-examples/view-flow/view-post-begin) | | 文章查询开始时触发 |
| [Filter_Plugin_ViewPost_Core](/php/dev-examples/view-flow/view-post-core) | `&$select, &$w, &$order, $limit, $option` | 文章查询条件组装后触发 |
