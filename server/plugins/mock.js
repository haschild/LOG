import Mock from "mockjs";

export default defineNitroPlugin((nitroApp) => {
  // 这里可以添加全局的 mock 配置
  // 例如：Mock.setup({ timeout: '200-600' })  // 如果您的 Mock 版本支持 setup 方法

  // 在这里定义您的 mock 接口
  if (process.env.NODE_ENV === "development") {
    Mock.mock("/api/example", "get", {
      "data|1-10": [
        {
          "id|+1": 1,
          name: "@cname",
          email: "@email",
        },
      ],
    });
  }

  // 可以根据需要添加更多的 mock 接口
});
