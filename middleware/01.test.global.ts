// import type { acceptModels,navigateModels } from "~/server/types/api";
export default defineNuxtRouteMiddleware((to, from) => {


    let passURL = ['/login','/'];
    if (passURL.includes(to.path)) {
        return true;
    }
    if (import.meta.client) {
        const token = localStorage.getItem('token');
        if (!token) {
            return navigateTo({
                path:"/login",
                query: {
                    code:401,
                    msg:"错误",
                }
            });
        }
    }






    
    
})
