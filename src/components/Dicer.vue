<template>
  <div>
    <h2>Dicer</h2>
    <div>{{ rollMultiple(5) }}</div>
    <div v-if="debug">
      <hr>
      {{ checkChances() }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dicer',
  props: {
    debug: Boolean,
    sides: Number,
  },
  methods: {
    roll() {
      return Math.floor(Math.random() * this.sides) + 1;
    },
    rollMultiple(amount) {
      return [...Array(amount)].map(this.roll);
    },
    checkChances() {
      const calc = this.rollMultiple(5);
      const calc2 = this.rollMultiple(5);
      const calc3 = this.rollMultiple(5);
      /* eslint-disable max-len */
      const filtered = [
        calc.filter(x => x === 1).length + calc2.filter(x => x === 1).length + calc3.filter(x => x === 1).length,
        calc.filter(x => x === 2).length + calc2.filter(x => x === 2).length + calc3.filter(x => x === 2).length,
        calc.filter(x => x === 3).length + calc2.filter(x => x === 3).length + calc3.filter(x => x === 3).length,
        calc.filter(x => x === 4).length + calc2.filter(x => x === 4).length + calc3.filter(x => x === 4).length,
        calc.filter(x => x === 5).length + calc2.filter(x => x === 5).length + calc3.filter(x => x === 5).length,
        calc.filter(x => x === 6).length + calc2.filter(x => x === 6).length + calc3.filter(x => x === 6).length,
      ];
      /* eslint-enable max-len */
      return `
        \n1 [${filtered[0]}],
        \n2 [${filtered[1]}],
        \n3 [${filtered[2]}],
        \n4 [${filtered[3]}],
        \n5 [${filtered[4]}],
        \n6 [${filtered[5]}],
      `;
    },
  },
};
</script>
