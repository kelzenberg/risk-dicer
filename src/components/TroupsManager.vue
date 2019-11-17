<template>
  <div>
    <b-card-group
      deck
      class="mb-4"
    >
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
          min="1"
          number
          :formatter="formatInput"
          autocomplete="false"
          :autofocus="player.id === 0"
          placeholder="Gib die Anzahl der Truppen ein"
          :disabled="fightStarted"
          @change="handleTroupsAmount(player.id, $event)"
        />
        <b-form-text>
          Gesamtsumme der {{ player.id === 0 ? 'angreifenden' : 'sich zu verteidigenden' }} Truppen
        </b-form-text>
        <div v-if="fightStarted">
          <hr>
          <div :key="debugRefresh">
            Results: {{ player.throwResults }}
          </div>
          <Thrower
            :throw-amount="player.throwAmount"
            @results="handleThrowResults(player.id, $event)"
          />
        </div>
      </b-card>
    </b-card-group>
    <div
      class="w-75 mx-auto"
    >
      <b-button
        size="lg"
        :variant="fightStarted ? 'secondary' : 'danger'"
        block
        @click="handleFightStart"
      >
        {{ fightStarted ? 'Reset' : 'Fight!' }}
      </b-button>
    </div>
  </div>
</template>

<script>
import Thrower from './Thrower.vue';

export default {
  name: 'TroupsManager',
  components: {
    Thrower,
  },
  props: {
    playerAmount: { type: Number, default: 2, required: true },
  },
  data() {
    return {
      debugRefresh: 0,
      adjectives: ['mutig', 'hoffnungsvoll', 'wutentbrannt', 'kriegerisch'],
      players: [],
      fightStarted: false,
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
    handleTroupsAmount(playerId, newTroupsAmount) {
      this.debugRefresh += 1; // DEBUG

      const newThrowAmount = this.calculateThrowAmount(playerId, newTroupsAmount);
      this.players[playerId].throwAmount = newThrowAmount;

      this.sliceThrowResults(playerId, newThrowAmount);

      this.debugRefresh += 1; // DEBUG
    },
    handleThrowResults(playerId, newThrowResults) {
      this.debugRefresh += 1; // DEBUG

      const player = this.players[playerId];
      player.throwResults = newThrowResults;

      this.sliceThrowResults(playerId, player.throwAmount);

      this.debugRefresh += 1; // DEBUG
    },
    sliceThrowResults(playerId, end) {
      const { throwResults } = this.players[playerId];
      this.players[playerId].throwResults = throwResults.slice(0, end);
    },
    handleFightStart() {
      this.fightStarted = !this.fightStarted;
    },
    calculateThrowAmount(playerId, newTroupsAmount) {
      /* TODO: logic for calculating correct amount of 3/2/1 dice throws
      depending on amount of troups goes here */
      return newTroupsAmount;
    },
  },
};
</script>
