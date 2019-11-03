<template>
  <Dice
    :sides="6"
    :amount="5"
  />
</template>

<script>
import Dice from '../components/Dice.vue';

export default {
  name: 'Home',
  components: {
    Dice,
  },
};
</script>
