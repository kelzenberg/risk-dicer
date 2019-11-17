<template>
  <b-container>
    <h2 class="mb-4">
      Risiko Würfler 9000
    </h2>
    <TroupsManager :player-amount="2" />
  </b-container>
</template>

<script>
import TroupsManager from '../components/TroupsManager.vue';

export default {
  name: 'Home',
  components: {
    TroupsManager,
  },
  data() {
    return {
    };
  },
};
</script>
