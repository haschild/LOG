<template>
  <div>
    <ChatBubble position="left"> Hello, how can I help you? </ChatBubble>
    <ChatBubble position="right">
      I need some information about your services.
    </ChatBubble>
    <ChatBubble position="left">
      Sure, what would you like to know?
    </ChatBubble>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  margin: 20px;
}
</style>
