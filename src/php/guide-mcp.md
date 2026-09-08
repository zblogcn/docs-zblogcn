# MCP 检索服务

## 简介

本文档站点已接入 `vitepress-plugin-mcp`，将 VitePress 文档以「[MCP Server](https://modelcontextprotocol.io/ "Model Context Protocol")」的形式对外提供检索能力。

启用后，支持 MCP 的 AI 客户端（如 Claude Desktop、Cursor、VS Code、opencode 等）可以直接检索 Z-Blog 官方文档内容，而无需手动复制粘贴整篇文档。

- 插件源码：[Hal-Spidernight/vitepress-plugin-mcp](https://github.com/Hal-Spidernight/vitepress-plugin-mcp "Hal-Spidernight/vitepress-plugin-mcp")
- npm 包：`vitepress-plugin-mcp`

## 工作原理

`vitepress-plugin-mcp` 是一个 Vite 插件。它：

1. 复用 VitePress 内置的本地全文搜索（`search.provider: 'local'`）所生成的 `search-index.json` 索引；
2. 在本地启动一个 Express 服务，作为 MCP Server 运行；
3. 通过名为 `search_vitepress_docs` 的工具（tool），按关键词检索文档并返回匹配内容。

> **重要：** 该插件依赖 VitePress 本地搜索的索引数据，因此必须在 `themeConfig.search` 中启用 `provider: 'local'`，且启动的是 `docs:dev`（开发服务器），插件才会启动 MCP Server。执行 `docs:build` 构建静态站点时，插件会自动跳过启动。

## 已提供的工具

| 名称                    | 说明                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `search_vitepress_docs` | 检索本产品的 VitePress 文档。传入一组关键词（中英文各最多 5 个、建议为单词），返回匹配的文档内容。 |

## 本地启用

### 1. 安装依赖

```bash
pnpm add -D vitepress-plugin-mcp
```

### 2. 配置 `.vitepress/config.mts`

在 `defineConfig` 中引入并启用插件：

```ts
import { defineConfig } from 'vitepress'
import { MCPPlugin } from 'vitepress-plugin-mcp'

export default defineConfig({
  themeConfig: {
    search: {
      provider: 'local',
      options: {}, // 必须存在
    },
    // ...其他主题配置
  },
  vite: {
    plugins: [MCPPlugin({ port: 4000 })] // 默认端口 4000
  },
})
```

**注：**

- `search` 必须配置为 `provider: 'local'`，且 `options` 不能为 `undefined`；
- `MCPPlugin` 可选的配置项：
  - `port`：MCP Server 监听端口，默认 `4000`；
  - `specPath`：OpenAPI 规范文件路径（可选）。

### 3. 启动开发服务器

```bash
pnpm run docs:dev
```

启动成功后，控制台会输出 MCP Server 地址：

```text
Streamable Server is running on http://localhost:4000/mcp
SSE Server is running on http://localhost:4000/mcp/__sse
```

> 插件会随开发服务器的文件变更自动重启 MCP Server。

## 在 AI 客户端中连接

将以下任意一个地址作为 MCP Server 的 URL 填入客户端即可：

- Streamable HTTP：`http://localhost:4000/mcp`
- SSE：`http://localhost:4000/mcp/__sse`

### Claude Desktop / Cursor / VS Code 等

在客户端的 MCP 配置中添加一条 `type: "sse"`（或 `streamable-http`）的服务：

```json
{
  "mcpServers": {
    "Z-Blog-Docs": {
      "type": "sse",
      "url": "http://localhost:4000/mcp/__sse"
    }
  }
}
```

### opencode

在 `opencode.json` 的 `mcp` 字段中增加：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "zblog-docs": {
      "type": "sse",
      "url": "http://localhost:4000/mcp/__sse",
      "enabled": true
    }
  }
}
```

## 校验

连接成功后，AI 客户端应能列出 `search_vitepress_docs` 工具。向其提问「请检索 Z-Blog 文档中关于 API 的内容」之类的请求即可验证检索是否生效。

## 注意事项

- 该 MCP Server 仅在本机 `docs:dev` 开发服务器运行期间可用，并未随静态站点对外发布；
- 如需在 CI / 构建流程中固定端口或做其他调整，请在 `.vitepress/config.mts` 中按需修改 `MCPPlugin` 配置；
- 插件依赖 VitePress 本地搜索索引，若后续更换为第三方搜索（如 Algolia、Pagefind），需同步评估该插件的兼容性。
