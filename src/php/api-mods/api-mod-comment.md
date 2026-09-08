## comment 评论管理 API

### 接口一览

| act | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `get` | GET / POST | 获取指定 `id` 的评论 | 无需鉴权 |
| `post` | POST | 发布评论 | 需鉴权 |
| `delete` | GET / POST | 删除指定 `id` 的评论 | 需鉴权 |
| `list` | GET / POST | 获取评论列表 | 管理模式需鉴权 |
| `check` | GET / POST | 审核评论 | 需鉴权 |
| `batch` | POST | 批量处理评论 | 需鉴权 |

### 接口说明

#### `get`：获取评论

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | int | 评论 ID |

请求示例：

```
mod=comment&act=get&id=1
```

#### `post`：发布评论

请求参数为 `$GLOBALS['datainfo']['Comment']` 中的数据字段，只需提交需要赋值的字段，字段名区分大小写。

> 与其它模块不同，`comment` 的 `post` 只能新增评论，**不能**通过指定 `ID` 修改已有评论；`AuthorID`、`IP`、`Agent`、`PostTime` 等字段由服务端根据当前登录用户自动填充。发布前需先登录，见「[登录和鉴权](/php/api-design#权限认证 "登录和鉴权")」。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `LogID` | int | 评论所属文章 ID，必填（也可用 `postid`） |
| `Name` | string | 评论者昵称；已登录用户会被其登录用户名覆盖 |
| `Email` | string | 评论者邮箱 |
| `HomePage` | string | 评论者网站 |
| `ReplyID` | int | 所回复评论的 ID，为 0 或不填则为顶层评论 |
| `Content` | string | 评论正文 |

请求示例：

```json
{
  "LogID": 1,
  "Name": "访客",
  "Email": "mail@example.com",
  "HomePage": "https://example.com",
  "ReplyID": 0,
  "Content": "写得很详细，收藏了。"
}
```

#### `delete`：删除评论

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | int | 要删除的评论 ID |

#### `list`：获取评论列表

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `manage` | int | 进入管理模式，例：`&manage=1` |
| `post_id` | int | 按文章 ID 过滤 |
| `auth_id` | int | 按评论作者 ID 过滤 |
| `ischecking` | int | 按审核状态过滤 |
| `root_id` | int | 按楼层（根评论）ID 过滤 |
| `parent_id` | int | 按父评论 ID 过滤 |

- 非管理模式（不传 `manage`）：仅需提供 `post_id` 返回指定文章已审核的公开评论，无需鉴权；
- 管理模式（`manage=1`）：需鉴权，不传 `post_id` 时返回全部评论，可配合 `auth_id`、`ischecking`、`root_id`、`parent_id` 等条件过滤。

分页、排序等共通参数见：「[约束与过滤](/php/api-design#约束与过滤 "约束与过滤")」。

请求示例：

```
mod=comment&act=list&post_id=1&page=1&perpage=20
mod=comment&act=list&manage=1&ischecking=1&sortby=PostTime&order=desc
```

#### `check`：审核评论

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | int | 要审核的评论 ID |
| `ischecking` | int | 目标审核状态：`1` 设为审核中（待审），`0` 通过审核，例：`&ischecking=1` |

#### `batch`：批量处理评论

以下三个操作参数任选其一，配合待处理评论的 ID 数组（`id`）使用：

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `all_del` | int | 删除所选评论 |
| `all_pass` | int | 通过所选评论的审核，例：`&all_pass=1` |
| `all_audit` | int | 将所选评论设为审核中 |
| `id` | array | 待处理评论的 ID，以表单数组形式提交（即 `$_POST['id']`，例如表单字段 `id[]`） |

请求示例：

```http
POST /zb_system/api.php?mod=comment&act=batch&all_pass=1
Content-Type: application/x-www-form-urlencoded

id[]=1&id[]=2&id[]=3
```
