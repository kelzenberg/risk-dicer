<template>
  <Dicer
    :sides="6"
    :amount="5"
  />
</template>

<script>
import Dicer from '../components/Dicer.vue';

export default {
  name: 'Home',
  components: {
    Dicer,
  },
};
</script>
