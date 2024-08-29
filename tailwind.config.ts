/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{vue,html,js}", "./components/**/*.{vue,html,js}"],
  corePlugins: {
    preflight: true, // 使用tailwind，覆盖默认样式
  },

  theme: {
    extend: {
      colors: {
        primary: {
          500:"var(--el-color-primary)",
          100:"#e9d5ff",
          400:"#c084fc",
          600:"#7e22ce",
        }
      },
    },
  },

  // ...
};
