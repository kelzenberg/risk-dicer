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
          v-model="player.troups"
          type="number"
          min="1"
          number
          :formatter="formatInput"
          autocomplete="false"
          :autofocus="player.id === 0"
          placeholder="Gib die Anzahl der Truppen ein"
          :disabled="fightStarted"
          @change="handleTroupsChange(player.id, $event)"
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
            v-for="(aThrow, aThrowId) in player.diceThrows"
            :key="player.id + '-' + aThrowId"
            :dices-for-throw="aThrow.diceAmount"
            @throwResult="handleThrowResult(player.id, aThrowId, $event)"
          />
        </div>
      </b-card>
    </b-card-group>
    <div
      class="w-75 mx-auto"
    >
      <div>attackerThrowResults: {{ attackerThrowResults }}</div>
      <div>defenderThrowResults: {{ defenderThrowResults }}</div>
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
      adjectives: ['mutig', 'hoffnungsvoll', 'wutentbrannt', 'kriegerisch', 'entschlossen', 'selbstbewusst', 'kühn', 'tapfer', 'forsch', 'verwegen', 'heldenhaft', 'wagemutig', 'beherzt', 'konzentriert', 'überlegt', 'gelassen', 'beharrlich', 'kaltblütig', 'wacker', 'unerschrocken', 'tollkühn', 'keck', 'furchtlos', 'couragiert', 'guten Mutes', 'draufgängerisch', 'stolz', 'optimistisch', 'zuversichtlich', 'rasant', 'energisch', 'schwungvoll', 'hartnäckig', 'rigoros', 'MIT EINEM F****** EINH0RN'],
      players: [],
      fightStarted: false,
    };
  },
  computed: {
    randomAdjectives() {
      const rand1 = Math.floor(Math.random() * this.adjectives.length);
      let rand2 = Math.floor(Math.random() * this.adjectives.length);
      while (rand1 === rand2) {
        rand2 = Math.floor(Math.random() * this.adjectives.length);
      }
      return [
        this.adjectives[rand1],
        this.adjectives[rand2],
      ];
    },
    attackerTroups() {
      return this.players[0].troups;
    },
    defenderTroups() {
      return this.players[1].troups;
    },
    attackerThrowResults() {
      return this.players[0].diceThrows.map(aThrow => aThrow.throwResult);
    },
    defenderThrowResults() {
      return this.players[1].diceThrows.map(aThrow => aThrow.throwResult);
    },
  },
  beforeMount() {
    this.setUpPlayers();
  },
  mounted() {
    this.setDiceAmountForPlayers();
  },
  methods: {

    /* Event Handler */

    handleTroupsChange(playerId, newTroups) {
      this.players[playerId].troups = newTroups;
      this.players[0].diceThrows = [{ diceAmount: 0, throwResult: [] }];
      this.players[0].diceThrows[0].diceAmount = this.getThisThrowsDiceAmount(playerId);
    },
    async handleThrowResult(playerId, aThrowId, throwResult) {
      this.players[playerId].diceThrows[aThrowId].throwResult = throwResult;
      // TODO: following...
      if (this.attackerTroups > 0 && this.defenderTroups > 0) {
        this.setThisThrowsWinner(aThrowId);
      }
    },
    handleFightStart() {
      // TODO: do resets etc.
      this.fightStarted = !this.fightStarted;
    },

    /* Business Logic */

    getThisThrowsDiceAmount(playerId) {
      const isAttacker = this.isAttacker(playerId);
      const maxDices = isAttacker ? 3 : 2;
      const troups = isAttacker ? this.attackerTroups : this.defenderTroups;
      //                           3(2)        2(1)          1(0)         0(-1)
      const diceCombinations = [maxDices, maxDices - 1, maxDices - 2, maxDices - 3]
        .filter(number => number > 0) // only amount above 0 (3,2,1 and 2,1)
        .map(dices => ({ // fill above 0s with infos
          dices,
          troups,
          fits: Math.floor(troups / dices) >= 1,
          fitsTimes: Math.floor(troups / dices),
        }));
        // return biggest (= first) fitting amount of dices for this throw
      return diceCombinations.filter(dices => dices.fits)[0].dices;
    },
    setThisThrowsWinner(throwId) {
      const attacker = this.players[0];
      const defender = this.players[1];
      const { attackerWon, defenderWon } = this.compareThrowResults(
        attacker.diceThrows[throwId].throwResult,
        defender.diceThrows[throwId].throwResult,
      );
      attacker.troups -= defenderWon;
      defender.troups -= attackerWon;
    },
    compareThrowResults(attackerResult, defenderResult) {
      // [4,2,5] vs. [6,1] or [2,1] vs. [2,1] or [4] vs. [1, 5]

      // reverse sorting: first = highest, last = lowest
      const attackerResultSorted = attackerResult.sort((a, b) => b - a);
      const defenderResultSorted = defenderResult.sort((a, b) => b - a);

      // [true, true] or [true, false]/[false, true] or [false, false]
      const matchResults = attackerResultSorted.map((attackerDice, index) => {
        const defenderDice = defenderResultSorted[index];
        if (!defenderDice) {
          return undefined;
        }
        return attackerDice > defenderDice; // if equal, defender always wins
      });

      const attackerWon = matchResults.filter(win => win === true).length;
      const defenderWon = matchResults.length - attackerWon;
      return { attackerWon, defenderWon };
    },

    /* Helper Functions */

    setUpPlayers() {
      this.players = [...Array(this.playerAmount)].map((_, index) => ({
        id: index,
        troups: 1,
        diceThrows: [], // e.g. [ { diceAmount: 3, throwResult: [ 2, 5, 6 ]} ]
      }));
    },
    setDiceAmountForPlayers() {
      this.players[0].diceThrows = [
        { diceAmount: this.getThisThrowsDiceAmount(0), throwResult: [] },
      ];
      this.players[1].diceThrows = [
        { diceAmount: this.getThisThrowsDiceAmount(1), throwResult: [] },
      ];
    },
    isAttacker(playerId) {
      return playerId === 0;
    },
    formatInput(value) {
      const converted = parseInt(value, 10);
      return converted >= 0 ? converted : 0;
    },
  },
};
</script>
