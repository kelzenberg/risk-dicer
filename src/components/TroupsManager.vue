<template>
  <div>
    <b-card-group
      deck
      class="mb-4"
    >
      <b-card
        v-for="player in players"
        :key="player.id"
        :title="player.id === 0 ? 'Angreifer' : 'Verteidiger'"
        :border-variant="player.id === 0 ? attackerBorderColor : defenderBorderColor"
      >
        <div class="mb-4">
          <b-card-text>
            wird {{
              player.id === 0 ?
                randomAdjectives[0] + ' angreifen!' :
                'sich ' +randomAdjectives[1] +' verteidigen!'
            }}
          </b-card-text>
          <b-form-input
            v-model="player.initialTroups"
            type="number"
            min="1"
            number
            :formatter="formatInput"
            autocomplete="false"
            :autofocus="player.id === 0"
            placeholder="Gib die Anzahl der Truppen ein"
            :disabled="fightStarted"
            @update="handleTroupsUpdate(player.id, $event)"
          />
          <b-form-text>
            Gesamtsumme der {{ player.id === 0
              ? 'angreifenden'
              : 'sich zu verteidigenden'
            }} Truppen
          </b-form-text>
        </div>
        <b-row>
          <b-col>
            <b-button
              variant="outline-secondary"
              size="lg"
              disabled
              class="w-100"
            >
              <div>{{ player.troupsLost }}</div>
              <div>verloren</div>
            </b-button>
          </b-col>
          <b-col>
            <b-button
              variant="outline-secondary"
              size="lg"
              disabled
              class="w-100"
            >
              <div>{{ player.troupsLeft }}</div>
              <div>{{ player.id === 0 ? 'attackieren' : 'verteidigen' }}</div>
            </b-button>
          </b-col>
          <b-col>
            <b-button
              variant="outline-secondary"
              size="lg"
              disabled
              class="w-100"
            >
              <div>{{ player.diceThrows[0].diceAmount }} von {{ player.id === 0 ? '3': '2' }}</div>
              <div>Startwürfel</div>
            </b-button>
          </b-col>
        </b-row>
        <div v-if="fightStarted">
          <hr>
          <Thrower
            v-for="(aThrow, aThrowId) in player.diceThrows"
            :key="player.id + '-' + aThrowId"
            :dices-to-throw="aThrow.diceAmount"
            :troups-left="player.troupsLeft"
            :class="player.id === 0 ? 'text-right': ''"
            @throwResult="handleThrowResult(player.id, aThrowId, $event)"
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
        <div v-if="fightLoading">
          <b-spinner label="Spinning" />
        </div>
        <div v-else>
          {{ fightStarted ? 'Reset' : 'Fight!' }}
        </div>
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
      initialTroups: 3,
      fightStarted: false,
      fightLoading: false,
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
    attackerBorderColor() {
      const { isWinner } = this.players[0];
      if (isWinner !== null) {
        return isWinner ? 'success' : 'danger';
      }
      return '';
    },
    defenderBorderColor() {
      const { isWinner } = this.players[1];
      if (isWinner !== null) {
        return isWinner ? 'success' : 'danger';
      }
      return '';
    },
    attackerTroupsLeft() {
      return this.players[0].troupsLeft;
    },
    defenderTroupsLeft() {
      return this.players[1].troupsLeft;
    },
    attackerTroupsLost() {
      return this.players[0].troupsLeft;
    },
    defenderTroupsLost() {
      return this.players[1].troupsLeft;
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
  methods: {

    /* Event Handler */

    handleTroupsUpdate(playerId, newTroups) {
      const player = this.players[playerId];
      player.initialTroups = newTroups;
      player.troupsLeft = newTroups;
      player.troupsLost = 0;
      this.setDiceAmountForPlayers();
    },
    handleThrowResult(playerId, aThrowId, throwResult) {
      this.players[playerId].diceThrows[aThrowId].throwResult = throwResult;
      this.updateTroupsForThrow(aThrowId);
    },
    handleFightStart() {
      this.fightLoading = true;
      setTimeout(() => {
        this.fightLoading = false;
        this.fightStarted = !this.fightStarted;
        if (!this.fightStarted) {
          this.setUpPlayers();
        }
      }, 1000);
    },

    /* Business Logic */

    getDiceAmountForThrow(playerId) {
      const isAttacker = this.isAttacker(playerId);
      const maxDices = isAttacker ? 3 : 2;
      const troupsLeft = isAttacker ? this.attackerTroupsLeft : this.defenderTroupsLeft;
      //                           3(2)        2(1)          1(0)         0(-1)
      const diceCombinations = [maxDices, maxDices - 1, maxDices - 2, maxDices - 3]
        .filter(number => number > 0) // only amount above 0 (3,2,1 and 2,1)
        .map(dices => ({ // fill above 0s with infos
          dices,
          troupsLeft,
          fits: Math.floor(troupsLeft / dices) >= 1,
          fitsTimes: Math.floor(troupsLeft / dices),
        }));
      // return biggest (= first) fitting amount of dices for this throw
      return diceCombinations.filter(dices => dices.fits)[0].dices;
    },
    updateTroupsForThrow(throwId) {
      const attacker = this.players[0];
      const defender = this.players[1];

      // makes sure all throwResults for all players-throws are in before evaluation
      const attackerDiceAmount = attacker.diceThrows[throwId].diceAmount;
      const defenderDiceAmount = defender.diceThrows[throwId].diceAmount;
      const attackerThrowResult = attacker.diceThrows[throwId].throwResult;
      const defenderThrowResult = defender.diceThrows[throwId].throwResult;
      if (
        attackerDiceAmount !== attackerThrowResult.length
        || defenderDiceAmount !== defenderThrowResult.length
      ) {
        return;
      }

      const {
        attackerWins,
        defenderWins,
      } = this.evaluateResultsFromThrow(
        attackerThrowResult,
        defenderThrowResult,
      );

      console.log(`attacker won ${attackerWins}x and has ${attacker.troupsLeft - defenderWins} out of ${attacker.troupsLeft} troups left`);
      console.log(`defender won ${defenderWins}x and has ${defender.troupsLeft - attackerWins} out of ${defender.troupsLeft} troups left`);
      attacker.troupsLost += defenderWins;
      defender.troupsLost += attackerWins;
      attacker.troupsLeft -= defenderWins;
      defender.troupsLeft -= attackerWins;

      if (attacker.troupsLeft > 0 && defender.troupsLeft > 0) {
        attacker.diceThrows[throwId + 1] = {
          diceAmount: this.getDiceAmountForThrow(0),
          throwResult: [],
        };
        defender.diceThrows[throwId + 1] = {
          diceAmount: this.getDiceAmountForThrow(1),
          throwResult: [],
        };
      } else if (this.fightStarted) {
        attacker.isWinner = attacker.troupsLeft > 0;
        defender.isWinner = defender.troupsLeft > 0;
      }
    },
    evaluateResultsFromThrow(attackerResult, defenderResult) {
      // [4,2,5] vs. [6,1] or [2,1] vs. [2,1] or [4] vs. [1, 5]

      // reverse sorting: first = highest, last = lowest
      const attackerResultSorted = attackerResult.sort((a, b) => b - a);
      const defenderResultSorted = defenderResult.sort((a, b) => b - a);

      // returns [true, true] or [true, false]/[false, true] or [false, false]
      const matchResults = attackerResultSorted
        .map((attackerDice, index) => {
          const defenderDice = defenderResultSorted[index];
          if (!defenderDice) {
            return undefined;
          }
          return attackerDice > defenderDice; // if equal, defender always wins
        })
        .filter(bool => bool !== undefined);

      const attackerWins = matchResults.filter(win => win === true).length;
      const defenderWins = matchResults.length - attackerWins;

      return { attackerWins, defenderWins };
    },

    /* Helper Functions */

    setUpPlayers() {
      const { initialTroups } = this;
      this.players = [...Array(this.playerAmount)].map((_, index) => ({
        id: index,
        initialTroups,
        troupsLeft: initialTroups,
        troupsLost: 0,
        // e.g.     [{ diceAmount: 3, throwResult: [ 2, 5, 6 ] }]
        diceThrows: [{ diceAmount: 1, throwResult: [] }],
        isWinner: null,
      }));

      this.setDiceAmountForPlayers();
    },
    setDiceAmountForPlayers() {
      this.players[0].diceThrows = [
        { diceAmount: this.getDiceAmountForThrow(0), throwResult: [] },
      ];
      this.players[1].diceThrows = [
        { diceAmount: this.getDiceAmountForThrow(1), throwResult: [] },
      ];
    },
    isAttacker(playerId) {
      return playerId === 0;
    },
    formatInput(value) {
      const converted = parseInt(value, 10);
      return converted > 0 ? converted : 1;
    },
  },
};
</script>
