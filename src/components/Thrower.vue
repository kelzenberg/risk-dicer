<template>
  <div>
    <h5>This throw resulted in:</h5>
    <Dice
      v-for="diceId in dicesForThrow"
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
    dicesForThrow: { type: Number, default: 0, required: true },
  },
  data() {
    return {
      sides: 6,
      throwResult: [],
    };
  },
  methods: {
    handleDiceRoll(diceId, diceRollResult) {
      this.throwResult[diceId - 1] = diceRollResult;
      this.$emit('throwResult', this.throwResult);
    },
  },
};
</script>
