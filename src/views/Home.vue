<template>
  <b-container>
    <h2>
      Nicer Dicer
    </h2>
    <h5 class="mb-4">
      Risiko over 9000
    </h5>
    <TroupsManager
      :player-amount="2"
      class="mb-5"
    />
    <footer
      id="footer"
    >
      code by <b-link
        href="https://github.com/kelzenberg"
        rel="author"
        target="_blank"
      >
        kelzenberg
      </b-link>
      , photo by <b-link
        href="https://unsplash.com/@tjump"
        rel="external"
        target="_blank"
      >
        Nik Shuliahin
      </b-link>
    </footer>
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

<style lang="scss" scoped>

#footer {
  position: relative;
  bottom: 0;
  height: 60px;
  line-height: 60px;
  color: gray;

  a {
    color: steelblue;
  }
}

</style>
