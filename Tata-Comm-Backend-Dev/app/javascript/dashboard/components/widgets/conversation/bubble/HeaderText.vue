<template>
  <div class="message-text__wrap simple-text">
    <div>
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-text.header-message-text{
    font-weight: bold;
}
.simple-text.footer-message-text{
    font-weight: lighter;
}
</style>
