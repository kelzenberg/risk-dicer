<template>
  <Dicer
    :sides="6"
    :debug="false"
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
