// https://nuxt.com/docs/api/configuration/nuxt-config

// https://unpkg.com/element-plus@2.7.8/dist/index.css
// https://unpkg.com/element-plus@2.7.8/dist/index.full.js


export default defineNuxtConfig({
  // 定义整个头部，也可以用 useHead 再次设置
  app: {
    head: {
      title:"Element Plus + Nuxt3 + tailwind css", 
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'ElementPlus + Nuxt3 + tailwindCSS',
        },
      ],
      script: [
        // { src: 'https://unpkg.com/element-plus@2.7.8/dist/index.full.js' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // { rel: 'stylesheet', href: 'https://unpkg.com/element-plus@2.7.8/dist/index.css' }
        {rel:"stylesheet",
          href:"https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"}
      ],
     
    },
    // 设置全局的动画效果
    pageTransition: {
      name: 'fadeIn',
    },
    // layoutTransition: { name: 'layout', mode: 'out-in' }
  },


  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build:{
    devServer:{
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    },
    
  },
  

  /**
   *区分生产和开发环境
   */ 
  $production: {
    routeRules: {
      '/**': { isr: true }
    }
  },
  $development: {
    //
  },

  /**
   *需要在构建后使用环境变量指定的私有或公共令牌。
   * 
   * 使用
   * const runtimeConfig = useRuntimeConfig()
   */
  runtimeConfig: {
    // 只在服务器端可用的私有键
    apiSecret: '123',
    // public中的键也可以在客户端使用
    public: {
      apiBase: '/api'
    }
  },

  nitro: {
    devProxy: {
      "^/log/": {
        target: "http://localhost:3000/log/getToken", // 这里是拦截的接口地址
        changeOrigin: true,
        prependPath: true,
      },
 
    },
    // plugins: ['~/server/plugins/mock.js']
  },


  /**
   * 
   * 将sass的颜色变量引入全局样式
   */
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 如果需要引入多个，在分号后面继续添加 @use "~/a/.scss"
          additionalData: `@use "~/assets/scss/element/index.scss" as ele;`,
        
        }
      },
    },

    // 配置vite打包排除模块
    ssr: {
      // external: ['element-plus']
    }
  },

  /**
   * 导入全局样式
   * 包含（本地样式，npm，url引用）都可以引用全局
   * 使用normalize.css 让浏览器样式统一
   */
  css: ['~/assets/scss/tailwind.css','animate.css','~/assets/scss/index.scss'], // npm 仓库样式引用全局

/**
 * 导入第三方模块
 * 
 * '',
 */
  modules: [
   '@nuxtjs/tailwindcss',
   '@element-plus/nuxt',
   '@nuxtjs/color-mode',
   '@vueuse/nuxt',
   '@pinia/nuxt',
   "@nuxt/icon",
   '@nuxtjs/mdc',
   '@nuxtjs/i18n',
  ],
 
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default
  },
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
    themes: ['dark'],
  },

    // vueuse
    vueuse: {
      ssrHandlers: true,
    },
  
    // colorMode
    colorMode: {
      classSuffix: '',
    },

    // 自动导入，pinaia 在页面可以直接使用
    pinia: {
      autoImports: ['defineStore', 'acceptHMRUpdate'],
    },

  
})