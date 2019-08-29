<template>
  <div class="classdoc">
    <!-- <div
      class="class-comment"
      v-for="(apiClass, indexClass) in classes"
    >{{apiClass.comment.shortText}}</div>-->
    <ClassDoc
      v-for="(item, index) in this.items"
      :key="index"
      v-if="item.children"
      :items="item.children"
      :groups="item.groups"
    />
    <PropertiesDoc v-if="this.properties.length" :items="this.properties" />
    <ConstantsDoc v-if="this.constants.length" :items="this.constants" />
    <SignaturesDoc v-if="this.methods.length" :items="this.methods" type="Methods" />
    <SignaturesDoc v-if="this.constructors.length" :items="this.constructors" type="Constructors" />
  </div>
</template>

<script>
export default {
  props: ['items', 'groups'],
  computed: {
    children: function() {
      return this.items.children;
    },
    properties: function() {
      return this.getElementsByKind('Properties').filter(
        property => property.comment,
      );
    },
    constants: function() {
      return this.getElementsByKind('Variables');
    },
    methods: function() {
      return this.getElementsByKind('Methods');
    },
    constructors: function() {
      return this.getElementsByKind('Constructors');
    },
    classes: function() {
      return this.getElementsByKind('Classes').concat(this.interfaces);
    },
    interfaces: function() {
      return this.getElementsByKind('Interfaces');
    },
  },
  methods: {
    getElementsByKind: function(kind) {
      return this.groups
        .filter(group => group.title === kind)
        .reduce((properties, group, index) => {
          return group.children;
        }, [])
        .map(propertyId =>
          this.items.filter(item => {
            return item.id === propertyId && !item.flags.isPrivate;
          }),
        )
        .flat();
    },
  },
};
</script>

<style lang="scss">
@import '../styles/constants.scss';

.classdoc {
  > .class-comment {
    border: 1px solid $textColor;
    border-radius: 1em;
    padding: 1em;
    background-color: $borderColor;
  }
}
.classdoc-item {
  display: grid;
  grid-template-columns: 180px auto;
}
.classdoc-item {
  margin: 1em 0;
  > .name {
    margin-right: 1em;
    font-size: 1.2em;
    color: #2c3e50;
  }
  > .comment.class-interface {
    grid-column: 1 / 4;
    background-color: #eaecef;
    padding: 1em;
    border: 1px solid #2c3e50;
    border-radius: 10px;
  }
}
</style>