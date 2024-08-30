import { zhCn, type en } from "element-plus/es/locale";

export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'en',
    messages: {
      en: {
        welcome: 'Welcome',
        en:"English",
        zhCn:"Chinese"
      },
      zhCn: {
        welcome: '欢迎',
       en:"英语",
        zhCn:"中文"
      }
    }
  }))
  