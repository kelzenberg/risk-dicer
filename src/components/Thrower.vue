<template>
  <div>
    <h5>Dices rolled:</h5>
    <Dice
      v-for="diceId in throwAmount"
      :key="diceId"
      :sides="sides"
      :number="diceId"
      @roll="handleDiceRoll(diceId, $event)"
    />
  </div>
</template>

<script>
import Dice from './Dice.vue';

export default {
  name: 'Thrower',
  components: {
    Dice,
  },
  props: {
    throwAmount: { type: Number, default: 0, required: true },
  },
  data() {
    return {
      sides: 6,
      throwResults: [],
    };
  },
  methods: {
    handleDiceRoll(diceId, diceResult) {
      this.throwResults[diceId - 1] = diceResult;
      this.$emit('results', this.throwResults);
    },
  },
};
</script>
