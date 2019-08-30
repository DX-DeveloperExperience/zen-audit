<template>
  <div class="properties">
    <h3>Constants</h3>
    <Comment
      class="constant"
      v-for="(constant, index) in this.items"
      :key="index"
      :item="constant"
    />
  </div>
</template>

<script>
export default {
  props: ['items'],
};
</script>

<style lang="scss">
@import '../styles/constants.scss';

.properties {
  margin: 1em;
  padding: 0.5em;
  box-shadow: 0 0.1em 0.2em $textColor;

  > h3 {
    margin-top: 0.5em;
  }
}
</style>