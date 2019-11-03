<template>
  <div>
    <b-card
      v-for="player in playerResults"
      :key="player.id"
    >
      <b-form-input
        v-model="player.throwAmount"
        type="number"
        min="1"
        change
        placeholder="Enter amount of dice throws"
        autocomplete="false"
        :autofocus="player.id === 0"
      />
      <div>id: {{ player.id }}</div>
      <div>throwAmount: {{ player.throwAmount }}</div>
      <div>throwResults: {{ player.throwResults }}</div>
      <hr>
      <div
        v-if="player.throwAmount > 0"
      >
        <Dice
          v-for="dice in player.throwAmount"
          :key="dice"
          :sides="sides"
          @roll="storeResult(player.id, dice, $event)"
        />
      </div>
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
    storeResult(playerId, diceId, result) {
      const currentThrows = this.playerResults[playerId].throwResults;
      if (currentThrows.length > diceId - 1) {
        this.playerResults[playerId].throwResults = currentThrows.slice(0, diceId - 1);
      }
      this.playerResults[playerId].throwResults[diceId - 1] = result;
    },
  },
};
</script>
