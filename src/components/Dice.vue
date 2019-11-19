<template>
  <span />
</template>

<script>
export default {
  name: 'Dice',
  props: {
    number: { type: Number, default: -1, required: true },
    sides: { type: Number, default: 6, required: true },
  },
  data() {
    return {
      result: null,
    };
  },
  mounted() {
    this.result = this.roll();
    this.$emit('roll', this.result);
  },
  methods: {
    roll() {
      const result = Math.floor(Math.random() * this.sides) + 1;
      return result;
    },
    /* rollMultiple(amount = 1) {
      return [...Array(amount)].map(this.roll);
    }, */
  },
};
</script>
