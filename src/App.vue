<template>
  <div>
    <router-view
      id="app"
      class="mt-5"
    />
    <footer id="footer">
      made by <b-link
        href="https://github.com/kelzenberg"
        rel="author"
        target="_blank"
      >
        kelzenberg
      </b-link>
    </footer>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 60px;
  text-align: center;
  color: darkgrey;

  a {
    color: lightsteelblue;
  }
}
</style>
