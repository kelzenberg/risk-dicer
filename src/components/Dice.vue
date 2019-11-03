<template>
  <div>
    <div>Dice Result: {{ result }}</div>
  </div>
</template>

<script>
export default {
  name: 'Dicer',
  props: {
    debug: { type: Boolean, default: false },
    sides: { type: Number, default: 6, required: true },
  },
  data() {
    return {
      result: null,
    };
  },
  mounted() {
    this.result = this.roll();
  },
  methods: {
    roll() {
      const result = Math.floor(Math.random() * this.sides) + 1;
      this.$emit('roll', result);
      return result;
    },
    /* rollMultiple(amount = 1) {
      return [...Array(amount)].map(this.roll);
    }, */
  },
};
</script>
