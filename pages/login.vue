<template>
  <div class="selection:bg-primary-500 selection:text-white">
    <div class="flex h-full w-dvw items-center justify-center bg-primary-100">
      <div class="flex-1 p-8">
        <div
          class="mx-auto w-80 overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div class="rounded-bl-4xl relative h-48 bg-primary-500">
            <svg
              class="absolute bottom-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="#ffffff"
                fill-opacity="1"
                d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,85.3C672,75,768,85,864,122.7C960,160,1056,224,1152,245.3C1248,267,1344,245,1392,234.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div class="rounded-tr-4xl bg-white px-10 pb-8 pt-4">
            <h1 class="text-2xl font-semibold text-gray-900">Welcome back!</h1>
            <form class="mt-12" action="" method="POST">
              <div class="relative">
                <input
                  id="email"
                  name="email"
                  type="text"
                  class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primary-600 focus:outline-none"
                  placeholder="john@doe.com"
                />
                <label
                  for="email"
                  class="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >Email address</label
                >
              </div>
              <div class="relative mt-10">
                <input
                  id="password"
                  type="password"
                  name="password"
                  class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:border-primary-600 focus:outline-none"
                  placeholder="Password"
                />
                <label
                  for="password"
                  class="absolute -top-3.5 left-0 text-sm text-gray-600 transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-gray-600"
                  >Password</label
                >
              </div>

              <input
                type="sumbit"
                value="Sign in"
                @click="Login"
                class="mt-20 block w-full cursor-pointer rounded bg-primary-500 px-4 py-2 text-center font-semibold text-white focus:outline-none focus:ring focus:ring-primary-500 focus:ring-opacity-80 focus:ring-offset-2 md:hover:bg-red-400 xl:hover:bg-primary-400"
              />
            </form>
            <a
              href="#"
              class="mt-4 block text-center text-sm font-medium text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import lodash from "lodash";
// 自定义中间件校验
definePageMeta({
  middleware: [
    "auth",
    function (to, from) {
      // 自定义内联中间件
      console.log("custom middleware", to);
      //   return abortNavigation("拒绝登录");
    },
  ],
});

const Login = () => {
  // 本地跳转
  localNavigate();

  // serveNavigate();
};

const serveNavigate = () => {
  // 服务端跳转
  fetch("http://localhost:3000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "admin",
      password: "123456",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // 解析 JSON 响应体
    })
    .then((responseData) => {
      console.log("Received JSON:", responseData); // 处理响应数据
      // 保存 token
      localStorage.setItem("token", responseData.token);
      // 跳转, 如果有会跳地址，优先跳转
      const route = useRoute();
      let path = <string>route.query.from || "/";
      navigateTo(path);
    })
    .catch((error) => {
      console.error("Error:", error); // 处理请求过程中发生的错误
    });
};

const localNavigate = () => {
  localStorage.setItem("token", "123456");
  // 跳转, 如果有会跳地址，优先跳转
  const route = useRoute();
  let path = <string>route.query.from || "/";
  navigateTo(path);
};
</script>
