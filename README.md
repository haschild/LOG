# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com.cn/docs/getting-started/configuration) to learn more.

## Setup

```bash
# npm
npm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

```

## Production

Build the application for production:

```bash
# npm
npm run build
```

Locally preview production build:

```bash
# npm
npm run preview
```

学习Nuxt3记录下过程

### 快速开始

1. 搭建好的Nuxt3项目[参考一](https://nuxt3-awesome-starter.vercel.app/post) | [参考二](https://github.com/antfu-collective/vitesse-nuxt3)
2. 虽然是收费的，不过也是使用tailwind css 所以可以参考布局[页面布局参考](https://www.reweb.so/)

### 选择框架

CSS 部分

1. TailWindCSS 快速实现自定义样式

    * [官网地址](https://tailwindcss.nuxtjs.org/)
    * [本地便捷查看样式](http://localhost:3000/_tailwind/)
    * [快速学习](https://juejin.cn/column/7045544678527074335/)

2. normalize.css 让浏览器样式统一

ui框架

1. elementUI-plus 作为UI框架
    * [Nuxt如何配置](https://nuxt.com/modules/element-plus)
    * GitHub 已经搭建好的项目 [Nuxt + element-plus  ](https://github.com/element-plus/element-plus-nuxt-starter/tree/main)

路由Router 使用 [pinia](https://nuxt.com/modules/pinia)
icon 可以用Nuxt自带的模块`@nuxt/icon`能选择的图片比elementUI-plus 多很多

### 部署服务

[netlify](https://www.netlify.com/) 提供前端部署服务，免费且直接可以使用Github仓库自动部署

### 问题

1. 初始化项目报错

```bash
pnpm dlx nuxi@latest init <project-name>
```

最后解决办法是根据错误提示，找到要下载的文件连接，用浏览器请求且下载文件，然后手动复制到指定目录下即可，参考地址https://segmentfault.com/q/1010000044611069

#### 研究

1. https://nuxt.com.cn/docs/getting-started/styling 看下 第三方库和模块
可以解决，全局样式，流行架构