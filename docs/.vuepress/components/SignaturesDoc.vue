<template>
  <div class="methods-doc">
    <h3>{{type}}</h3>
    <div class="method" v-for="(method, index) in items" :key="index">
      <Signature
        class="signature"
        v-for="(signature, index) in method.signatures"
        :key="index"
        :item="signature"
        :decorates="isDecorator(method)"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'type'],
  methods: {
    isDecorator: function(method) {
      return (
        method.decorates ||
        (method.signatures &&
          method.signatures[0].comment &&
          method.signatures[0].comment.tags &&
          method.signatures[0].comment.tags[0].tag !== undefined &&
          method.signatures[0].comment.tags[0].tag === 'decorator')
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/mixins.scss';
.methods-doc {
  @include shadow-box;

  > h3 {
    margin: 0;
  }

  > .signatures {
    margin-top: 1em;
  }
}
</style>