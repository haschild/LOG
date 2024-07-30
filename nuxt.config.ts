// https://nuxt.com/docs/api/configuration/nuxt-config



export default defineNuxtConfig({
  // 定义整个头部，也可以用 useHead 再次设置
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },


  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },


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

  /**
   * 
   * 将sass的颜色变量引入全局样式
   */
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_colors.scss" as *;'
        }
      }
    }
  },

  /**
   * 导入全局样式
   * 包含（本地样式，npm，url引用）都可以引用全局
   * 使用normalize.css 让浏览器样式统一
   */
  // css: ['~/assets/css/main.css']
  css: ['@unocss/reset/normalize.css','animate.css'], // npm 仓库样式引用全局

/**
 * 导入第三方模块
 */
  modules: ['@element-plus/nuxt','@unocss/nuxt'],
  elementPlus: { 
    // themes:"dark",
    components:["ElButton"]
   }
  
})