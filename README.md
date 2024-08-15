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

## 快速开始
* GitHub 开箱即用
    https://nuxt3-awesome-starter.vercel.app/post
* 页面布局参考，直观调整页面，且用taillwindcss控制样式
    https://www.reweb.so/




## 技术框架

#### 前端框架

1. TailwindCSS 控制页面自适应 
* 官网地址（https://tailwindcss.nuxtjs.org/）|  unocss https://unocss.dev/ 也是不错的
* 本地便捷查看样式 http://localhost:3000/_tailwind/

2. normalize.css 让浏览器样式统一

3. elementUI-plus 
    * nuxt如何配置element-plus  https://nuxt.com/modules/element-plus 
    * GitHub 已经搭建好的项目 Nuxt + element-plus  https://github.com/element-plus/element-plus-nuxt-starter/tree/main

7. Router 使用 pinia https://nuxt.com/modules/pinia

8. @vueuser/core 添加vue3 组合 API 钩子， 简化 Vue 组件的逻辑喝状态管理 https://github.com/antfu-collective/vitesse-nuxt3 | https://nuxt.com/modules/vueuse

10. icon 可以用nuxt自带的模块 @nuxt/icon 能选择的图片比elementUI-plus 多很多


#### 部署服务
1. netlify https://www.netlify.com/ 提供前端部署服务


## 问题

1. 初始化项目报错

```bash
pnpm dlx nuxi@latest init <project-name>
```
最后解决办法是根据错误提示，找到要下载的文件连接，用浏览器请求且下载文件，然后手动复制到指定目录下即可，参考地址https://segmentfault.com/q/1010000044611069


## 研究
1. https://nuxt.com.cn/docs/getting-started/styling 看下 第三方库和模块
可以解决，全局样式，流行架构