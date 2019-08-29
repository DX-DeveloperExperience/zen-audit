<template>
  <div class="comment" v-if="comment">
    <b class="name" v-if="name && this.item.kindString !== 'Class'">{{name}}</b>
    <Badge v-if="badgeText && badgeText !== ''" :text="badgeText" />
    <div class="text" v-if="text">{{text}}</div>
    <div class="text" v-else>Documentation not ready yet.</div>
  </div>
</template>

<script>
export default {
  props: ['item', 'badgeText'],
  computed: {
    comment: function() {
      return this.item.comment;
    },
    name: function() {
      return this.item.name;
    },
    text: function() {
      return this.comment.shortText;
    },
  },
};
</script>

<style lang="scss" scoped>
.comment {
  margin-top: 1em;
  > .name {
    margin-right: 1em;
  }

  > .text {
    margin-left: 2em;
    margin-top: 0.5em;
  }
}
</style>