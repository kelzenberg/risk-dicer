<template>
  <div>
    <router-view
      id="app"
      class="mt-5"
    />
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html {
  background-image: url('./assets/background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
}
body {
  background-color: rgba(255,255,255,0) !important;
}
</style>
