<template>
  <div>
    <Dice
      v-for="diceId in dicesToThrow"
      :key="diceId"
      :sides="sides"
      :number="diceId"
      @roll="handleDiceRoll(diceId, $event)"
    />
    <div>{{ throwResult }}</div>
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
    dicesToThrow: { type: Number, default: 1, required: true },
    troupsLeft: { type: Number, required: true },
  },
  data() {
    return {
      sides: 6,
      throwResult: [],
      leftTroups: 0,
    };
  },
  mounted() {
    this.leftTroups = this.troupsLeft;
  },
  methods: {
    handleDiceRoll(diceId, diceRollResult) {
      this.throwResult[diceId - 1] = diceRollResult;
      this.$emit('throwResult', this.throwResult);
    },
  },
};
</script>
