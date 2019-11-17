<template>
  <div>
    <b-card-group deck>
      <b-card
        v-for="player in players"
        :key="player.id"
        :title="player.id === 0 ? 'Spieler A' : 'Spieler B'"
      >
        <b-card-text>
          wird {{
            player.id === 0 ?
              randomAdjectives[0] + ' angreifen!' :
              'sich ' +randomAdjectives[1] +' verteidigen!'
          }}
        </b-card-text>
        <b-form-input
          v-model="player.troupsAmount"
          type="number"
          number
          min="1"
          :formatter="formatInput"
          placeholder="Gib die Anzahl der Truppen ein"
          autocomplete="false"
          :autofocus="player.id === 0"
          @change="handleInputChange(player.id, $event)"
        />
        <b-form-text>
          Gesamtsumme der {{ player.id === 0 ? 'angreifenden' : 'sich zu verteidigenden' }} Truppen
        </b-form-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>

export default {
  name: 'TroupsManager',
  components: {
  },
  props: {
    playerAmount: { type: Number, default: 2, required: true },
  },
  data() {
    return {
      debugRefresh: 0,
      adjectives: ['mutig', 'hoffnungsvoll', 'wutentbrannt', 'kriegerisch'],
      players: [],
    };
  },
  computed: {
    randomAdjectives() {
      return [
        this.adjectives[Math.floor(Math.random() * this.adjectives.length)],
        this.adjectives[Math.floor(Math.random() * this.adjectives.length)],
      ];
    },
  },
  beforeMount() {
    this.players = [...Array(this.playerAmount)].map((_, index) => ({
      id: index,
      troupsAmount: 0,
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
      this.players[playerId].throwResults[diceId - 1] = result;
    },
    handleInputChange(playerId, newThrowAmount) {
      this.debugRefresh += 1; // DEBUG
      const { throwResults } = this.players[playerId];
      const slicedThrowResults = throwResults.slice(0, newThrowAmount);
      this.players[playerId].throwResults = slicedThrowResults;
      this.debugRefresh += 1; // DEBUG
    },
  },
};
</script>
