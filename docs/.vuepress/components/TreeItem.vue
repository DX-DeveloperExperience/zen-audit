
<template>
  <li>
    <div :class="{bold: isFolder}" @click="toggle">
      <h3 class="item-name">
        {{ item.name }}
        <span v-if="!isFolder">{{ item.content.children[0].kindString }}</span>
        <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
      </h3>
    </div>
    <ul v-show="isOpen" v-if="isFolder">
      <tree-item class="item" v-for="(child, index) in item.children" :key="index" :item="child"></tree-item>
    </ul>
    <div v-else v-show="showClassDoc" @click="toggle">
      <ClassDoc :items="item.content.children" :groups="item.content.groups" />
    </div>
  </li>
</template>

<script>
export default {
  props: ['item'],
  data: function() {
    return {
      isOpen: false,
      showClassDoc: false,
    };
  },
  computed: {
    isFolder: function() {
      return this.item.children && this.item.children.length;
    },
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.isOpen = !this.isOpen;
      } else {
        this.showClassDoc = !this.showClassDoc;
      }
    },
  },
};
</script>

<style>
li {
  list-style: none;
}
.item {
  cursor: pointer;
}
.item-name {
  text-transform: capitalize;
}
</style>