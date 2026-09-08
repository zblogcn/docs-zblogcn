import { defineConfig } from 'vitepress'
import { MCPPlugin } from 'vitepress-plugin-mcp'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Z-Blog 官方文档",
  description: "Z-Blog / Z-BlogPHP / Z-BlogASP 官方文档",
  lang: 'zh-CN',
  srcDir: 'src',
  outDir: 'dist',
  lastUpdated: true,
  cleanUrls: true,
  // 忽略预期的失效链接（markup 子站、old 旧版存档等）
  ignoreDeadLinks: true,
  // 站点域名，用于生成 sitemap.xml
  sitemap: {
    hostname: 'https://docs.zblogcn.com'
  },
  // 内置的本地全文搜索（MiniSearch）
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/favicon.ico',
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'full'
      }
    },
    nav: [
      { text: '首页', link: '/' },
      { text: 'Z-BlogPHP', link: '/php/' },
      { text: 'Z-BlogASP', link: '/asp/' },
      { text: 'Z-Blog 官网', link: 'https://www.zblogcn.com/' },
      { text: '应用中心', link: 'https://app.zblogcn.com/' }
    ],

    sidebar: {
      '/php/': [
        {
          text: '开始',
          items: [
            { text: '下载安装', link: '/php/start-install' },
            { text: '配置管理', link: '/php/start-option' },
            { text: '插件和主题', link: '/php/start-apps' },
            { text: '文件结构', link: '/php/start-structures' },
            { text: '常见问题', link: '/php/start-faq' }
          ]
        },
        {
          text: '应用开发',
          items: [
            { text: '开始', link: '/php/dev-start' },
            { text: '主题开发', link: '/php/dev-theme' },
            { text: '主题开发【唐朝版】', link: '/php/dev-theme-tang' },
            { text: '插件开发', link: '/php/dev-plugin' },
            { text: '接口列表', link: '/php/dev-interfaces' },
            { text: '函数列表', link: '/php/dev-functions' },
            { text: '页面路由', link: '/php/dev-route' },
            { text: 'SQL 链式查询', link: '/php/dev-chainquery' },
            { text: '自定义数据类型', link: '/php/dev-custom-object' },
            { text: '网络组件', link: '/php/dev-network' },
            { text: '发布应用', link: '/php/dev-publish' },
            { text: '常见问题', link: '/php/dev-faq' }
          ]
        },
        {
          text: 'API',
          items: [
            { text: '基本设计', link: '/php/api-design' },
            { text: '接口文档', link: '/php/api-mods' },
            { text: '自定义 API', link: '/php/api-custom' },
            { text: '常见问题', link: '/php/api-faq' },
            { text: '本地调用 API', link: '/php/api-exec' },
            { text: '调试插件', link: '/php/api-plugin' }
          ]
        },
        {
          text: '参与协作',
          items: [
            { text: '文档规范', link: '/php/guide-docs' },
            { text: 'MCP 检索服务', link: '/php/guide-mcp' }
          ]
        },
        {
          text: '更新记录',
          items: [
            { text: '版本历史', link: '/php/feat-history' }
          ]
        }
      ],
      '/asp/': [
        {
          text: '开始',
          items: [
            { text: '下载安装', link: '/asp/start-install' },
            { text: '配置管理', link: '/asp/start-option' },
            { text: '插件和主题', link: '/asp/start-apps' },
            { text: '常见问题', link: '/asp/start-faq' }
          ]
        },
        {
          text: '应用开发',
          items: [
            { text: '开始', link: '/asp/dev-app-start' },
            { text: '主题开发', link: '/asp/dev-app-theme' },
            { text: '插件开发', link: '/asp/dev-app-plugin' },
            { text: '接口列表', link: '/asp/dev-interfaces' },
            { text: '函数列表', link: '/asp/dev-functions' },
            { text: '发布应用', link: '/asp/dev-app-publish' },
            { text: '常见问题', link: '/asp/dev-app-faq' }
          ]
        }
      ]
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zblogcn' }
    ],

    footer: {
      message: 'Z-Blog 官方文档 · 由 Z-Blog 团队维护',
      copyright:
        'Copyright © 2026 Z-Blog · <a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow noopener">豫ICP备2026041506号-1</a>'
    }
  },
  // 将 VitePress 作为 MCP Server 提供文档检索能力（见 /php/guide-mcp）
  vite: {
    plugins: [MCPPlugin({ port: 4000 })]
  }
})
