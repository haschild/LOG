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

