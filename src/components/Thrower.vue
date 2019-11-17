<template>
  <div>
    <b-card
      v-for="player in playerResults"
      :key="player.id"
    >
      <b-form-input
        v-model="player.throwAmount"
        type="number"
        number
        min="1"
        :formatter="formatInput"
        placeholder="Enter amount of dice throws"
        autocomplete="false"
        :autofocus="player.id === 0"
        @change="handleInputChange(player.id, $event)"
      />
      <div :key="debugRefresh">
        <!-- DEBUG -->
        <h5>Player info:</h5>
        <div>player.id: {{ player.id }} ({{ typeof player.id }})</div>
        <div>throwAmount: {{ player.throwAmount }} ({{ typeof player.throwAmount }})</div>
        <div>throwResults: {{ player.throwResults }}</div>
      </div>
      <hr>
      <h5>Dices rolled:</h5>
      <Dice
        v-for="diceId in player.throwAmount"
        :key="diceId"
        :sides="sides"
        :number="diceId"
        @roll="handleRoll(player.id, diceId, $event)"
      />
    </b-card>
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
    players: { type: Number, default: 2, required: true },
  },
  data() {
    return {
      debugRefresh: 0,
      sides: 6,
      playerResults: [],
    };
  },
  beforeMount() {
    this.playerResults = [...Array(this.players)].map((_, index) => ({
      id: index,
      throwAmount: 0,
      throwResults: [],
    }));
  },
  methods: {
    formatInput(value) {
      const converted = parseInt(value, 10);
      return converted >= 0 ? converted : 0;
    },
    handleRoll(playerId, diceId, result) {
      this.playerResults[playerId].throwResults[diceId - 1] = result;
    },
    handleInputChange(playerId, newThrowAmount) {
      this.debugRefresh += 1; // DEBUG
      const { throwResults } = this.playerResults[playerId];
      const slicedThrowResults = throwResults.slice(0, newThrowAmount);
      this.playerResults[playerId].throwResults = slicedThrowResults;
      this.debugRefresh += 1; // DEBUG
    },
  },
};
</script>
