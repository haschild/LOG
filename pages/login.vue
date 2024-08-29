<template>
  <div class="selection:bg-primary-500 selection:text-white">
    <div class="bg-primary-100 flex h-full w-dvw items-center justify-center">
      <div class="flex-1 p-8">
        <div
          class="mx-auto w-80 overflow-hidden rounded-3xl bg-white shadow-xl"
        >
          <div class="rounded-bl-4xl bg-primary-500 relative h-48">
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
                  class="focus:border-primary-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none"
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
                  class="focus:border-primary-600 peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none"
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
                class="bg-primary-500 hover:bg-primary-400 focus:ring-primary-500 mt-20 block w-full cursor-pointer rounded px-4 py-2 text-center font-semibold text-white focus:outline-none focus:ring focus:ring-opacity-80 focus:ring-offset-2"
              />
            </form>
            <a
              href="#"
              class="text-primary-600 focus:ring-primary-500 mt-4 block text-center text-sm font-medium hover:underline focus:outline-none focus:ring-2"
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
</script>
