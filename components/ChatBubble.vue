<template>
  <div class="chat-bubble" :class="position">
    <div class="bubble-content">
      <slot></slot>
      <div class="triangle" :class="position">
        <span></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatBubble",
  props: {
    position: {
      type: String,
      default: "left", // 'left' or 'right'
    },
  },
};
</script>

<style scoped>
.chat-bubble {
  display: flex;
  margin: 10px;
}

.chat-bubble.left {
  position: inherit;
  justify-content: flex-start;
}

.chat-bubble.right {
  justify-content: flex-end;
}

.bubble-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.chat-bubble.left .bubble-content {
  border-top-left-radius: 0;
}

.chat-bubble.right .bubble-content {
  border-top-right-radius: 0;
  background-color: #e0f7fa;
}

.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
}

.chat-bubble.left .triangle {
  top: 10px;
  left: -10px;
  border-width: 10px 10px 10px 0;
  border-color: transparent #fff transparent transparent;
  border-right-color: #ccc; /* Match the border color of the bubble */
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); */
  width: 10px;
  height: 10px;
  z-index: 1;
}

.chat-bubble.left .triangle span {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  top: 0;
  border-style: solid;
  border-width: 10px 10px 10px 0;
  border-color: transparent #fff transparent transparent;
  border-right-color: red; /* Match the border color of the bubble */
  z-index: 99;
}

.chat-bubble.right .triangle {
  top: 10px;
  right: -10px;
  border-width: 10px 0 10px 10px;
  border-color: transparent transparent transparent #e0f7fa;
  border-left-color: #ccc; /* Match the border color of the bubble */
}
</style>
