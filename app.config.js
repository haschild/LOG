/**
 * 构建的公共变量，且不能在runtimeConfig中重置
 * 
 * 使用
 * const appConfig = useAppConfig()
 * 
 * 在构建时确定的公共令牌，网站配置（如主题变体、标题）以及不敏感的项目配置等
 */



export default defineAppConfig({
    title: 'Hello Nuxt',
    theme: {
      dark: true,
      colors: {
        primary: '#ff0000'
      }
    }
  })
  