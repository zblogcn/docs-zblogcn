## 「前台页面」输出

| 接口 | 参数 | 说明 |
| --- | --- | --- |
| [Filter_Plugin_ViewList_Template](/php/dev-examples/view-template/list) | `Template $template` | 列表页模板渲染前触发 |
| [Filter_Plugin_ViewPost_Template](/php/dev-examples/view-template/post) | `Template $template` | 文章/页面详情页模板渲染前触发 |
| [Filter_Plugin_ViewSearch_Template](/php/dev-examples/view-template/search) | `Template $template` | 搜索结果页模板渲染前触发 |
| [Filter_Plugin_ViewComments_Template](/php/dev-examples/view-template/comments) | `Template $template` | 评论列表（AJAX）模板渲染前触发 |
| [Filter_Plugin_ViewComment_Template](/php/dev-examples/view-template/comment) | `Template $template` | 单条评论（AJAX）模板渲染前触发 |

## 「前台页面」流程

| 接口                           | 参数                                   | 说明 |
| ------------------------------ | -------------------------------------- | ---- |
| Filter_Plugin_Index_Begin      |
| Filter_Plugin_Index_End        |
| Filter_Plugin_ViewIndex_Begin  | `str $url`                             |
| Filter_Plugin_ViewAuto_Begin   | `str $inpurl`,`str $url`               |
| Filter_Plugin_ViewAuto_End     | `str $url`                             |
| Filter_Plugin_Feed_Begin       |
| Filter_Plugin_Feed_End         |
| Filter_Plugin_ViewFeed_Begin   |
| Filter_Plugin_ViewFeed_Core    | `arr $w`                               |
| Filter_Plugin_ViewFeed_End     | `obj $rss2`                            |
| Filter_Plugin_ViewList_Begin   |
| Filter_Plugin_ViewList_Core    |
| Filter_Plugin_Search_Begin     |
| Filter_Plugin_Search_End       |
| Filter_Plugin_ViewSearch_Begin |
| Filter_Plugin_ViewSearch_Core  |
| Filter_Plugin_ViewPost_Begin   |
| Filter_Plugin_ViewPost_Core    | `$select, $w, $order, $limit, $option` |
