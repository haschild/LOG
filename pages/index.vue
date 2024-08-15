


<template>
  <el-main>
    <section class=" flex flex-col items-center gap-8 pt-20 sm:gap-10">
      <div>
        <span class="text-sm">Introducing Reweb</span>
        <span class="iconify" data-icon="mdi:github"></span>
      </div>
      <h1 class="text-center font-heading text-4xl font-semibold sm:text-5xl sm:leading-tight max-w-5xl">Edit this template or click "New Design" to start building from scratch</h1>
      <p class="max-w-lg text-center text-lg text-muted-foreground sm:text-xl">Build at the speed of no-code. Export Next.js & Tailwind code. Customize with no limits.</p>
      <div class="grid grid-cols-2 gap-3">
        <el-link src="#" name="i-uil:github" size="large">Learn More</el-link>
      <el-button size="large" type="primary">Get Started</el-button>
      </div>
    </section>
    <section class="mt-10">
      <div class="flex flex-col gap-3">
        <span class="text-center uppercase text-[var(--el-color-primary)]">FAQ</span>
        <h2 class="text-center font-heading text-3xl">Frequently Asked Questions</h2>
        

        <el-collapse class="mt-6 w-full divide-y max-w-3xl mx-auto my-0 border-0" v-model="activeNames" @change="handleChange">
      <el-collapse-item title="How is Reweb different than tools like Framer or Webflow?" name="1">
        <div>
          Consistent with real life: in line with the process and logic of real
          life, and comply with languages and habits that the users are used to;
        </div>
        <div>
          Consistent within interface: all elements should be consistent, such
          as: design style, icons and texts, position of elements, etc.
        </div>
      </el-collapse-item>
      <el-collapse-item title="How long does it take to learn Reweb?" name="2">
        <div>
          Operation feedback: enable the users to clearly perceive their
          operations by style updates and interactive effects;
        </div>
        <div>
          Visual feedback: reflect current state by updating or rearranging
          elements of the page.
        </div>
      </el-collapse-item>
      <el-collapse-item title="What does the exported code look like?" name="3">
        <div>
          Simplify the process: keep operating process simple and intuitive;
        </div>
        <div>
          Definite and clear: enunciate your intentions clearly so that the
          users can quickly understand and make decisions;
        </div>
        <div>
          Easy to identify: the interface should be straightforward, which helps
          the users to identify and frees them from memorizing and recalling.
        </div>
      </el-collapse-item>
      <el-collapse-item title="How long does it take to make a landing page with Reweb?" name="4">
        <div>
          Decision making: giving advices about operations is acceptable, but do
          not make decisions for the users;
        </div>
        <div>
          Controlled consequences: users should be granted the freedom to
          operate, including canceling, aborting or terminating current
          operation.
        </div>
      </el-collapse-item>
    </el-collapse>
        
      </div>

    </section>
  </el-main>
</template>

<script setup lang="ts">
const activeNames = ref("1");

const handleChange = ()=>{}
</script>

  