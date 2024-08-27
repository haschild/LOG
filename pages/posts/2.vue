<template>
  <div>
    <section class="mb-4" v-for="(group, index) of webSiteGroup" :key="index">
      <h1 class="text-md font-bold" v-text="group.groupName"></h1>

      <div class="justify-left mt-4 flex w-full items-center gap-4">
        <div
          v-for="site of group.webSiteList"
          :key="site.name"
          @click="HandleOpen(site.url)"
          class="gradient-border text-md flex cursor-pointer items-center gap-4 px-4 py-2 sm:px-4 sm:py-2 sm:text-xl"
        >
          <Icon v-if="site.icon" :name="site.icon"></Icon>
          <div class="inline-block">
            <h4 class="text-xl font-semibold" v-text="site.name"></h4>
            <div class="text-sm" v-text="site.desc"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { WebSiteGroup } from "~/server/types/models";
// 网站地址
let webSiteGroup = ref<WebSiteGroup[]>([]);
webSiteGroup.value = [
  {
    groupName: "搜索引擎",
    webSiteList: [
      {
        name: "Google",
        url: "https://www.google.com",
        desc: "Google 是全球最大的搜索引擎",
        icon: "logos:google",
      },
    ],
  },
  {
    groupName: "开发工具",
    webSiteList: [
      {
        name: "GitHub",
        desc: "GitHub 是全球最大的代码托管平台",
        url: "https://github.com",
        icon: "logos:github-icon",
      },
      {
        name: "StackOverflow",
        desc: "StackOverflow 是全球最大的技术问答网站",
        url: "https://stackoverflow.com",
      },
    ],
  },
  {
    groupName: "其他",
    webSiteList: [
      {
        name: "Gitee",
        desc: "Gitee 是全球最大的代码托管平台",
        url: "https://gitee.com",
        icon: "logos:gitee",
      },
      {
        name: "Vue",
        desc: "Vue 是一个渐进式 JavaScript 框架",
        url: "https://cn.vuejs.org",
      },
    ],
  },
];

/**
 * 点击后开启新窗口
 * @param url 链接地址
 */
const HandleOpen = (url: string) => {
  window.open(url);
};
</script>
