# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com.cn/docs/getting-started/configuration) to learn more.

## Setup

这里推荐使用npm，使用yarn网络即便开启代理都不一定成功

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

## 问题

1. 初始化项目报错

```bash
pnpm dlx nuxi@latest init <project-name>
```
最后解决办法是根据错误提示，找到要下载的文件连接，用浏览器请求且下载文件，然后手动复制到指定目录下即可，参考地址https://segmentfault.com/q/1010000044611069


## 研究
1. https://nuxt.com.cn/docs/getting-started/styling 看下 第三方库和模块
可以解决，全局样式，流行架构


## 开箱即用模板
1. https://nuxt3-awesome-starter.vercel.app/post



## 技术框架
1. netlify https://www.netlify.com/ 提供前端部署服务
2. TailwindCSS 控制页面自适应 （https://tailwindcss.nuxtjs.org/）  unocss https://unocss.dev/ 也是不错的
3. Nuxt Ui 作为基本框架
4. normalize.css 让浏览器样式统一
5. elementUI-plus https://nuxt.com/modules/element-plus |  https://github.com/element-plus/element-plus-nuxt-starter/tree/main
6. 查看 tailwind css 用法 http://localhost:3000/_tailwind/
7. Router 使用 pinia https://nuxt.com/modules/pinia
8. @vueuser/core 添加vue3 组合 API 钩子， 简化 Vue 组件的逻辑喝状态管理 https://github.com/antfu-collective/vitesse-nuxt3 | https://nuxt.com/modules/vueuse
9. 如果是参考怎么快速搭建页面 https://www.reweb.so/ 虽然是收费的网站，快速出草图和能看到页面结构并且也是用tailwind css 所以真不错
