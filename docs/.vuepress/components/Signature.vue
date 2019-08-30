<template>
  <div class="signature-wrap" v-if="this.signature">
    <Comment
      :item="{...item, name: this.formattedSignature}"
      :badgeText="(decorates ? 'Decorator': '')"
    />
    <Comment v-for="(parameter, index) in this.parameters" :key="index" :item="parameter" />
  </div>
</template>

<script>
export default {
  props: ['item', 'decorates'],
  computed: {
    signature: function() {
      return this.item;
    },
    formattedSignature: function() {
      return (
        this.name +
        '(' +
        this.formattedParameters +
        '): ' +
        this.formattedSignatureType
      );
    },
    name: function() {
      return this.signature.name;
    },
    parameters: function() {
      this.signature.parameters;
    },
    formattedParameters: function() {
      if (this.parameters) {
        return this.parameters.reduce((resultStr, parameter, index) => {
          if (index > 0) {
            resultStr = ', ' + resultStr;
          }
          resultStr += parameter.name + ': ' + parameter.type.name;
        }, '');
      }
      return '';
    },
    formattedSignatureType: function() {
      if (this.signature.type.type === 'array') {
        return this.signature.type.elementType.name + '[]';
      } else if (this.signature.type.type === 'instrinsic') {
        return this.signature.type.name;
      } else if (this.signature.type.type === 'reference') {
        return (
          this.signature.type.name + '<' + this.formattedTypeArguments + '>'
        );
      }
    },
    formattedTypeArguments: function() {
      if (this.signature.type.typeArguments) {
        return this.signature.type.typeArguments.reduce(
          (resultStr, typeArg, index) => {
            let result = '';
            if (index > 0) {
              result += ' | ';
            }
            result += typeArg.name;
            if (typeArg.type === 'array') {
              result += '[]';
            }
            return resultStr + result;
          },
          '',
        );
      } else {
        return 'Anonymous function';
      }
    },
  },
};
</script>

<style>
</style>