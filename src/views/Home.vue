<template>
  <b-container>
    <Thrower :players="2" />
  </b-container>
</template>

<script>
import Thrower from '../components/Thrower.vue';

export default {
  name: 'Home',
  components: {
    Thrower,
  },
  data() {
    return {
      amount: 1,
    };
  },
};
</script>
