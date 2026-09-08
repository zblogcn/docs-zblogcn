# 文档规范

## 前言

您可以 `pull` 「本文档项目」 到本地，然后安装依赖预览编辑后的效果：

<!-- @include: ./terms/repo-docs.md -->

推荐按照「[Git 使用](#git-使用)」一节的方法进行操作；

**重要：请使用支持 `.editorconfig` 的编辑器或安装相应插件，以实现最基本的格式统一。**

本文档由 `docsify` 迁移至 `VitePress`，仓库结构如下：

- 文档内容存放于 `src/` 目录（`src/php/`、`src/asp/` 等）；
- 站点配置位于 `.vitepress/config.mts`；
- 样式、布局等自定义可放于 `.vitepress/` 目录。

## 本地预览配置

**重要：需要安装 `Node.js`；「[Node.js](https://nodejs.org/zh-cn "Node.js")」**

本文档基于 `VitePress` 搭建，采用 `pnpm` 作为包管理器（也可使用 `npm` / `yarn`）。您可以通过以下命令在本地预览编辑后的效果：

```bash
# 进入项目文件夹
cd document

# 安装依赖（如使用 npm 可改为 npm install）
pnpm install

# 启动本地开发服务器（默认端口 5173）
pnpm run docs:dev

# 或直接调用 vitepress dev
npx vitepress dev

# 生成静态站点（输出到 .vitepress/dist）
pnpm run docs:build
```

**注：**

1. 虽然不推荐，但是也可以不安装 `pnpm`，仅使用 `npm` / `npx` 运行上面的 `docs:*` 脚本；
2. 仅使用适合的「代码编辑器」或「Markdown 编辑器」对文件进行编辑后提交亦可；
3. `@lint-md/cli` 用来对文本排版进行规范，见「[格式规范检查](#格式规范检查)」；
4. 对于 VSCode 编辑器，可在安装依赖后：
   1. 使用快捷键 `ctrl + shift + b` 自动执行 `pnpm run docs:dev` 命令；
   2. 「菜单栏」→「终端」→「运行任务」→「`lint-md cli`」调用语法检查；

## VitePress 使用技巧

> VitePress 文档：[https://vitepress.dev/zh/](https://vitepress.dev/zh/ "VitePress")

### 嵌套调用重复内容

将需要重复使用的内容单独写进一个「\*.md 文件」，然后在目标文档中用 `@include` 语法引用：在 `<!--` 与 `-->` 之间写入 `@include:` 并跟一个空格及相对路径即可。本文档的 `terms/` 目录即存放此类重复片段，引用方式与下面的实际效果相同：

效果如下：

<!-- @include: ./terms/host.md -->

<!-- @include: ./terms/path.md -->

独立成段使用时效果如上，同段落有其他内容时则作为指向链接，[类似这样](/php/terms/repo-docs)。

> 该语法由 VitePress 内建支持，可参考「[VitePress Markdown 扩展 - 包含文件](https://vitepress.dev/zh/guide/markdown#github-style-tables "Markdown 包含")」。

**重要：不要指定 `Prettier` 作为「\*.md 文件」的格式化插件， 嵌套语法的单引号会变成双引号。**

### 导航与侧边栏

- 顶部导航、侧边栏、页脚等站点结构配置于 `.vitepress/config.mts`；
- 文档文件路径即对应页面路由，例如 `src/php/start-install.md` 对应 `/php/start-install`；
- 修改了文件目录结构后，需同步更新 `config.mts` 中的 `sidebar` 与页面内链接。

## 文法约定

| 形式                   | 适用                                                               | 附加     |
| ---------------------- | ------------------------------------------------------------------ | -------- |
| `zb_system`            | 一个实际存在的文件（夹）/文字对应的路径、链接或按钮/一个命令或操作 | 前后空格 |
| 「本文档」「后台管理」 | 名词概念性的强调                                                   |          |
| **注：内容**           | 整段内容强调，                                                     |          |
| **重要：内容**         | 整段内容强调，重要程度比上边高                                     |          |

## 格式规范检查

本文档使用 lint-md 检查格式规范，配置文件位于 `/mdlint.json`。您可以安装 VSCode 插件「[mdLint - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=wdssmq.mdlint "mdLint - Visual Studio Marketplace")」实时检查，或者通过 [lint-md/cli](https://github.com/lint-md/cli "lint-md/cli") 进行检查和修复。

您通过 `Pull request` 或者直接提交到本仓库后，会运行 `GitHub Action` 来自动检查格式规范。

## 代码片段（VSCode）

**注：中文文本后的英文字符无法触发代码片段，需要前边空一格且关掉中文输入法。**

**注：快捷键： `ctrl + space` 。**

代码片段定义存放于 `guide-docs/guide-snippets.json`，可将其内容合并进 VSCode 的「用户代码片段」文件（`用户.json` / `markdown.json`）中使用。主要包括：

- `inc_include` / `inc_terms`：插入重复内容片段，会生成 `@include` 引用；
- `php`：插入 PHP 代码块；
- `**`：插入「**注：**」/「**重要：**」强调；
- `code`：插入行内代码。

## Git 使用

> 可视化工具可以使用「[TortoiseGit](https://tortoisegit.org/download/ "TortoiseGit")」或「[GitKraken](https://www.gitkraken.com/download "GitKraken")」；

1、Fork 项目仓库到自己的账号下；「[zblogcn/docs-zblogphp: Z-BlogPHP Documentation](https://github.com/zblogcn/docs-zblogphp "zblogcn/docs-zblogphp: Z-BlogPHP Documentation")」

2、克隆自己的仓库到本地，并按如下命令操作；

`wdssmq`替换为自己的用户名；

```bash
# 初始
YOUR_NAME=wdssmq
YOUR_REPO_URL=git@github.com:$YOUR_NAME/docs-zblogphp.git
ZBP_REPO_URL=git@github.com:zblogcn/docs-zblogphp.git

# 克隆
git clone $YOUR_REPO_URL

# 进入目录，后续操作都在该目录下进行
cd docs-zblogphp

# 重命名
git remote rename origin $YOUR_NAME

# 设置 remote.pushdefault
git config remote.pushdefault $YOUR_NAME

# 添加官方仓库，用于同步更新
git remote add zbp $ZBP_REPO_URL

# ↑ 以上操作只需执行一次……

# 查看
git remote -v

# wdssmq  git@github.com:wdssmq/docs-zblogphp.git (fetch)
# wdssmq  git@github.com:wdssmq/docs-zblogphp.git (push)
# zbp     git@github.com:zblogcn/docs-zblogphp.git (fetch)
# zbp     git@github.com:zblogcn/docs-zblogphp.git (push)

```

> Win 系统下建议用 VSCode + Git Bash，然后通过`code ~/.bashrc`设置自己的 Git 用户名；
> ```ini
> export GIT_USR=wdssmq
> export GIT_USER=wdssmq
> ```

3、基于 main 创建新分支，修改内容后提交；


```bash

# ↓ 用于查看分支信息，会经常用到
git branch -a -vv

# 确保当前分支为 main，并且同步官方内容
git switch main
git pull zbp main

# 创建新分支，同一分支下仅修改互相关联的内容，可多次提交，此处示例加了日期，实际可按需命名
git switch -c feat-$(date +"%Y-%m-%d") && git branch -a -vv
# git switch -c feat-2023-03-23 && git branch -a -vv

# 推送，记得更换远程仓库名和分支名，$GIT_USR 需要在 .bashrc 内设置
git push -u $GIT_USR feat-$(date +"%Y-%m-%d")
# git push -u wdssmq feat-2023-03-23

# 注：对于同一个分支，首次带 `-u` 参数提交后大概后续可以直接用 `git push` 提交

# 下边命令用于将 main 分支推送到自己仓库
git push $GIT_USR main

```

4、在 GitHub 上提交 Pull request，等待审核合并；

- **同一分支下可以继续提交内容，但仅限同一内容主旨**；
- 新的内容请按第 3 步创建新分支；
- 代码被合并后相应的分支可以按需删除；
