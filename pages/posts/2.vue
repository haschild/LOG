<template>
  <div>
    <h1>常用网站</h1>
  <div class="flex w-full items-center justify-center">
    
    <div class="flex items-center gap-4  gradient-border text-md cursor-pointer px-4 py-2 sm:px-4 sm:py-2 sm:text-xl">
      <Icon name="logos:google"></Icon>
      <div>
        <h4 class="text-xl font-semibold">Google</h4>
        <div class="text-sm">搜索网站</div>
      </div>
    </div>

    <div>
      <h1 class="animate__animated animate__bounce">An animated element</h1>
    </div>
    
  </div>
  </div>
</template>

<script setup lang="ts"></script>

<style>

.gradient-border {
  position: relative;
  border-radius: 0.5rem;
  backdrop-filter: blur(10px);
}
@media (prefers-color-scheme: light) {
  .gradient-border {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .gradient-border::before {
    background: linear-gradient(
      90deg,
      #e2e2e2 0%,
      #e2e2e2 25%,
      #00dc82 50%,
      #36e4da 75%,
      #0047e1 100%
    );
  }
}
@media (prefers-color-scheme: dark) {
  .gradient-border {
    background-color: rgba(20, 20, 20, 0.3);
  }
  .gradient-border::before {
    background: linear-gradient(
      90deg,
      #303030 0%,
      #303030 25%,
      #00dc82 50%,
      #36e4da 75%,
      #0047e1 100%
    );
  }
}
.gradient-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  padding: 2px;
  width: 100%;
  background-size: 400% auto;
  opacity: 0.5;
  transition:
    background-position 0.3s ease-in-out,
    opacity 0.2s ease-in-out;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
.gradient-border:hover::before {
  background-position: -50% 0;
  opacity: 1;
}

</style>
