<template>
  <el-header class="flex items-center bg-[var(--el-color-primary)]">
    <div class="text-center lg:w-1/3 xl:w-1/5">
      <h4 class="text-white"><Icon name="logos:nuxt-icon" /> Nuxt Ui</h4>
      <Icon
        class="fixed bottom-0 right-0 text-white"
        name="iconoir:arrow-up-circle"
      />
    </div>
    <div class="lg:flex-1 xl:flex-1">
      <el-menu
        mode="horizontal"
        class="justify-center"
        router
        background-color="var(--el-color-primary)"
        text-color="white"
        active-text-color="white"
      >
        <el-menu-item index="/">主页</el-menu-item>
        <el-menu-item index="/website">网站</el-menu-item>
        <el-menu-item index="/posts/1">文章记录</el-menu-item>
      </el-menu>
    </div>
    <div class="flex items-center justify-end gap-5 pr-10 lg:w-8 xl:w-1/5">
      <!-- 国际化 -->
      <el-dropdown>
        <Icon class="cursor-pointer text-xl" name="iconoir:language" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="(item, index) in ['en', 'zhCn'].filter(
                (item) => item !== $i18n.locale,
              )"
              :key="index"
              :divided="index !== 0"
              @click="$i18n.locale = item"
              >{{ $t(item) }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <div
        @click="handleCheckBtn"
        class="item-right inline-block h-6 w-6 cursor-pointer text-2xl"
      >
        <Sunny class="text-xl" />
      </div>
      <Icon
        class="cursor-pointer text-xl"
        @click="VisitGithub"
        name="logos:github-icon"
      ></Icon>
    </div>
  </el-header>
</template>
<script lang="ts" setup>
import { Sunny } from "@element-plus/icons-vue";
const color = useColorMode();
const colorMode = computed({
  get: () => color.value === "dark",
  set: () => (color.preference = color.value === "dark" ? "light" : "dark"),
});
const { locale } = useI18n();
const handleCheckBtn = () => {
  color.preference = color.value === "dark" ? "light" : "dark";
  console.log(locale, "===============");
};

const VisitGithub = () => {
  window.open("https://github.com/haschild/LOG");
};
</script>
