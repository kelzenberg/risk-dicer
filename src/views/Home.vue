<template>
  <b-container>
    <h2>
      Nicer Dicer
    </h2>
    <h5 class="mb-4">
      Risiko over 9000
    </h5>
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
