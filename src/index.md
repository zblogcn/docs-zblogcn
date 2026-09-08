---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Z-Blog 官方文档"
  text: "Z-BlogPHP / Z-BlogASP"
  tagline: 开源免费、小巧强大的博客程序与 CMS 建站系统文档
  actions:
    - theme: brand
      text: Z-BlogPHP 文档
      link: /php/
    - theme: alt
      text: Z-BlogASP 文档
      link: /asp/

features:
  - title: Z-BlogPHP
    details: 基于 PHP 平台，支持 MySQL、SQLite 和 PostgreSQL 数据库的博客程序与建站系统。
    link: /php/
    linkText: 查看 PHP 文档
  - title: Z-BlogASP
    details: 基于 ASP 平台，支持 Access、MSSQL 数据库的博客程序。
    link: /asp/
    linkText: 查看 ASP 文档
  - title: Z-Blog 网站群
    details: Z-Blog 唯一官方网站、应用中心、官方博客、技术交流中心等。
    link: https://www.zblogcn.com/
    linkText: 前往官方网站
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatar.zblogcn.com/avatar/id/6401c4a7-89cd-48f9-a68b-d6464d8c3bc8',
    name: '沉冰浮水',
  },
  {
    avatar: 'https://avatar.zblogcn.com/avatar/id/a400e25e-fcdc-4b68-959c-e608595f2bc0',
    name: 'zhouzishu',
  },
  {
    avatar: 'https://avatar.zblogcn.com/avatar/id/3f27c237-91b5-48fa-99dd-d07f16b6a3f7',
    name: '未寒',
  },
  {
    avatar: 'https://avatar.zblogcn.com/avatar/id/57f578d3-9983-4771-9847-a9b45489cf77',
    name: '唐朝',
  },
  {
    avatar: 'https://avatar.zblogcn.com/avatar/id/5729eaac-ae97-4745-b60f-471f9fcb9e8b',
    name: 'zx.asd',
  },

]
</script>

## Z-BLOG 网站群

- Z-Blog 唯一官方网站：<https://www.zblogcn.com/>
- Z-Blog 的官方文档：<https://docs.zblogcn.com/>
- Z-Blog 的应用中心：<https://app.zblogcn.com/>
- Z-Blog 的官方博客：<https://blog.zblogcn.com/>
- ZBlogger 技术交流中心：<https://bbs.zblogcn.com/>
- Z-Blog 用户中心：<https://uc.zblogcn.com/>
- Z-Blog 更新及下载服务：<https://update.zblogcn.com/>
- Z5 加密：<https://z5encrypt.com/>

## 文档团队

Z-Blog 官方文档由 Z-Blog 团队与社区贡献者共同维护。

<VPTeamMembers size="small" :members />
