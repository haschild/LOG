/**
 * 路由中间件，其实就是路由守卫
 */

export default defineNuxtRouteMiddleware((to, from) => {
    console.error('auth middleware')
    if (to.params.id === '1') {
      return abortNavigation("你被禁止了访问此页面!")
    }
    // 在实际应用中，你可能不会将每个路由重定向到 `/`
    // 但是在重定向之前检查 `to.path` 是很重要的，否则可能会导致无限重定向循环
    if (to.path !== '/') {
      return navigateTo('/')
    }
  })
  